import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {MdClose} from 'react-icons/md';
import {FiChevronLeft} from 'react-icons/fi';
import {BsArrowRight} from 'react-icons/bs';

import Button from 'components/Button';
import UserOptionLabel, {UserIcon} from 'components/UserOptionLabel';
import RadioInput from 'components/Inputs/RadioInput';

import List from '@ra/components/List';
import Modal from '@ra/components/Modal';
import withVisibleCheck from '@ra/components/WithVisibleCheck';
import MultiSelectInput from '@ra/components/Form/MultiSelectInput';
import Form, {InputField} from '@ra/components/Form';
import Dropdown from '@ra/components/Dropdown';

import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';

import Toast from 'services/toast';
import Api from 'services/api';

import styles from './styles.scss';

const keyExtractor = item => item.id;
const userValueExtractor = (item) => `${item?.firstName || ''} ${item?.lastName || ''}`;

const organizationOptions = [
    {
        id: 'member',
        title: 'Member',
    },
    {
        id: 'admin',
        title: 'Admin',
    }
];

const splitUserModes = users => {
    const admins = users.filter(usr => usr.mode === 'admin');
    const members = users.filter(usr => usr.mode !== 'admin');
    return [admins, members];
};

const UserOption = ({title, checked, onClick}) => {
    const handleClick = useCallback(() => {
        if(checked) {
            return;
        }
        onClick();
    }, [checked, onClick]);

    return (
        <div className={styles.optionItem} onClick={handleClick}>
            <RadioInput
                size={20}
                checked={checked}
            />
            {title}
        </div>
    );
};

const UserItem = ({item, organization}) => {
    const {user} = useSelector(state => state.auth);

    const [{loading}, updateOrganizationUser] = usePromise(Api.editOrganization);

    const handleSwitchToAdmin = useCallback(async () => {
        try {
            const newMembers = organization.members.filter(el => el !== item.id);
            await updateOrganizationUser({
                admins: [...organization.admins, item.id],
                members: newMembers,
            }, organization.id);
            Toast.show('User role successfully updated!', Toast.SUCCESS);
            Api.getOrganizations();
        } catch (error) {
            Toast.show(getErrorMessage(error), Toast.DANGER);
            console.log(error);
        }

    }, [organization, item, updateOrganizationUser]);

    const handleSwitchToMember = useCallback(async () => {
        try {
            const newAdmins = organization.admins.filter(el => el !== item.id);
            await updateOrganizationUser({
                admins: newAdmins,
                members: [...organization.members, item.id],
            }, organization.id);
            Toast.show('User role successfully updated!', Toast.SUCCESS);
            Api.getOrganizations();
        } catch (error) {
            Toast.show(getErrorMessage(error), Toast.DANGER);
            console.log(error);
        } 
    }, [organization, item, updateOrganizationUser]);

    const renderButton = useCallback(() => (
        <Button 
            outline
            loading={loading} 
            className={styles.editButton}
        >
            Edit
        </Button>
    ), [loading]);

    return (
        <div className={styles.userItem}>
            <UserIcon item={item} className={styles.userAvatar} />
            <p className={styles.userName}>{userValueExtractor(item)}</p>
            {user.id !== item.id && (
                <Dropdown 
                    renderLabel={renderButton}
                    align="right"
                >
                    <div className={styles.userOptions}>
                        <UserOption 
                            onClick={handleSwitchToAdmin}
                            title="Admin" 
                            checked={item.mode === 'admin'} 
                        />
                        <UserOption 
                            onClick={handleSwitchToMember}
                            title="Member" 
                            checked={item.mode === 'member'} 
                        />
                    </div>
                </Dropdown>
            )}
        </div>
    );
};

const RequestItem = ({item}) => {
    const [{loading: approving}, approveRequest] = usePromise(Api.approveOrganizationMember);
    const [{loading: rejecting}, rejectRequest] = usePromise(Api.rejectOrganizationMember);

    const handleApprove = useCallback(async () => {
        try {
            await approveRequest(item.id);
            Toast.show('Request approved!', Toast.SUCCESS);
            Api.getOrganizationMemberRequests();
            Api.getOrganizations();
        } catch(error) {
            console.log(error);
        }
    }, [item, approveRequest]);
    const handleDecline = useCallback(async () => {
        try {
            await rejectRequest(item.id);
            Toast.show('Request rejected!', Toast.SUCCESS);
            Api.getOrganizationMemberRequests();
        } catch(error) {
            console.log(error);
        }
    }, [item, rejectRequest]);

    return (
        <div className={styles.requestItem}>
            <UserIcon item={item.user} className={styles.requestAvatar} />  
            <div className={styles.requestDetails}>
                <span className={styles.requestName}>
                    {userValueExtractor(item.user)}
                </span> wants to join this organization.
                <div className={styles.buttons}>
                    <Button
                        className={styles.button}
                        onClick={handleApprove}
                        loading={approving}
                    >
                        Approve
                    </Button>
                    <Button
                        className={styles.button}
                        secondary
                        onClick={handleDecline}
                        loading={rejecting}
                    >
                        Decline
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ManageMembersModal = (props) => {
    const {onClose, organization} = props;
    const {memberRequests} = useSelector(state => state.organization);

    const [{loading, result: users}, getUsers] = usePromise(Api.getUsers);
    const [{loading: saving}, editMembers] = usePromise(Api.editOrganization);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const organizationUsers = useMemo(() => {
        if(!users?.results?.length) {
            return [];
        }
        const orgUsers = [...new Set([
            ...organization.admins, 
            ...organization.members
        ])];
        return orgUsers.map(usr => {
            return {
                ...users.results.find(el => el.id === usr), 
                mode: organization.admins.some(el => el === usr) ? 'admin' : 'member'
            };
        });
    }, [organization, users]);

    const [adminUsers, memberUsers] = useMemo(() => splitUserModes(organizationUsers), [organizationUsers]);

    const pendingRequests = useMemo(() => {
        return memberRequests.filter(req => 
            req.organization === organization.id && req.status === 'pending'
        ).map(req => ({
            ...req, 
            user: users?.results?.find(el => el.id === req.user) || req.user,
        }));
    }, [memberRequests, organization, users]);

    const [respondMode, setRespondMode] = useState(false);

    const handleUpdateUsers = useCallback(async formData => {
        try {
            const [admins, members] = splitUserModes(formData.users);
            await editMembers({
                admins: admins.map(el => el.id), 
                members: members.map(el => el.id),
            }, organization.id);
            Toast.show('Changes saved!', Toast.SUCCESS);
            Api.getOrganizations();
        } catch(error) {
            Toast.show(getErrorMessage(error), Toast.DANGER);
            console.log(error);
        }
    }, [editMembers, organization]);

    const toggleRespondMode = useCallback(() => {
        setRespondMode(!respondMode);
    }, [respondMode]);

    const renderOptionsLabel = useCallback(listProps => (
        <UserOptionLabel {...listProps} userOptions={organizationOptions} />
    ), []);

    const renderUserItem = useCallback(listProps => (
        <UserItem organization={organization} {...listProps} />
    ), [organization]);

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                {respondMode && (
                    <FiChevronLeft 
                        size={28} 
                        className={styles.backIcon}
                        onClick={toggleRespondMode} 
                    />
                )}
                <h2 className={styles.title}>
                    {respondMode ? 'Respond to requests' : 'Manage Members'}
                </h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            {respondMode ? (
                <div className={styles.content}>
                    <List 
                        className={styles.requests}
                        data={pendingRequests}
                        keyExtractor={keyExtractor}
                        renderItem={RequestItem}
                    />
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.requestInfo}>
                        <p className={styles.requestText}>
                            Member Requests
                            <span className={styles.requestNumber}>
                                {` (${pendingRequests.length})`}
                            </span>
                        </p>
                        {!!pendingRequests.length && (
                            <div className={styles.respondLink} onClick={toggleRespondMode}>
                                Respond to all requests
                                <BsArrowRight size={22} className={styles.rightArrowIcon} />
                            </div>
                        )}
                    </div>
                    <h5 className={styles.sectionTitle}>
                        Add New Members
                    </h5>
                    <Form 
                        className={styles.editForm}
                        onSubmit={handleUpdateUsers}
                    >
                        <InputField
                            name="users"
                            component={MultiSelectInput}
                            containerClassName={styles.inputContainer}
                            controlClassName={styles.multiSelect}
                            placeholder='Select Users'
                            keyExtractor={keyExtractor}
                            valueExtractor={userValueExtractor}
                            defaultValue={organizationUsers}
                            loading={loading}
                            renderOptionLabel={renderOptionsLabel}
                            renderControlLabel={UserIcon}
                            options={users?.results}
                        />
                        <Button loading={saving} className={styles.saveButton}>Save</Button>
                    </Form>
                    <div className={styles.listContainer}>
                        <h5 className={styles.sectionTitle}>
                            Admins
                        </h5> 
                        <List
                            className={styles.userList}
                            data={adminUsers}
                            keyExtractor={keyExtractor}
                            renderItem={renderUserItem}
                        />
                        <h5 className={styles.sectionTitle}>
                            Members
                        </h5> 
                        <List
                            className={styles.userList}
                            data={memberUsers}
                            keyExtractor={keyExtractor}
                            renderItem={renderUserItem}
                        />
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default withVisibleCheck(ManageMembersModal);

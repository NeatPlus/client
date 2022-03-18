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
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';

import Toast from 'services/toast';
import Api from 'services/api';

import styles from './styles.scss';

const keyExtractor = item => item.id;
const userKeyExtractor = item => item.username;
const userValueExtractor = (item) => `${item.firstName} ${item.lastName}`;

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

const UserItem = ({item, organization, getOrgUsers}) => {
    const {user} = useSelector(state => state.auth);

    const [{loading}, upsertOrganizationUsers] = usePromise(Api.upsertOrganizationUsers);

    const handleSwitchToAdmin = useCallback(async () => {
        try {
            await upsertOrganizationUsers(organization.id, [{
                user: item.username,
                role: 'admin',
            }]);
            getOrgUsers(organization.id);
            Toast.show(_('User role successfully updated!'), Toast.SUCCESS);
        } catch (error) {
            Toast.show(getErrorMessage(error), Toast.DANGER);
            console.log(error);
        }

    }, [organization, upsertOrganizationUsers, item, getOrgUsers]);

    const handleSwitchToMember = useCallback(async () => {
        try {
            await upsertOrganizationUsers(organization.id, [{
                user: item.username,
                role: 'member',
            }]);
            getOrgUsers(organization.id);
            Toast.show(_('User role successfully updated!'), Toast.SUCCESS);
        } catch (error) {
            Toast.show(getErrorMessage(error), Toast.DANGER);
            console.log(error);
        } 
    }, [organization, item, upsertOrganizationUsers, getOrgUsers]);

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
            {user.username !== item.username && (
                <Dropdown 
                    renderLabel={renderButton}
                    align="right"
                >
                    <div className={styles.userOptions}>
                        <UserOption 
                            onClick={handleSwitchToAdmin}
                            title={_('Admin')} 
                            checked={item.mode === 'admin'} 
                        />
                        <UserOption 
                            onClick={handleSwitchToMember}
                            title={_('Member')}
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
            Toast.show(_('Request approved!'), Toast.SUCCESS);
            Api.getOrganizationMemberRequests();
            Api.getOrganizations();
        } catch(error) {
            console.log(error);
        }
    }, [item, approveRequest]);
    const handleDecline = useCallback(async () => {
        try {
            await rejectRequest(item.id);
            Toast.show(_('Request rejected!'), Toast.SUCCESS);
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
                </span> <Localize>wants to join this organization.</Localize>
                <div className={styles.buttons}>
                    <Button
                        className={styles.button}
                        onClick={handleApprove}
                        loading={approving}
                    >
                        <Localize>Approve</Localize>
                    </Button>
                    <Button
                        className={styles.button}
                        secondary
                        onClick={handleDecline}
                        loading={rejecting}
                    >
                        <Localize>Decline</Localize>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ManageMembersModal = (props) => {
    const [searchValue, setSearchvalue] = useState('');
    const [newOrgUsers, setNewOrgUsers] = useState(null);

    const {onClose, organization} = props;
    const {memberRequests} = useSelector(state => state.organization);

    const [{loading: loadingUsers, result: users}, getUsers] = usePromise(Api.getUsers);
    const [{loading: saving}, upsertUsers] = usePromise(Api.upsertOrganizationUsers);
    const [{loading: removing}, removeUsers] = usePromise(Api.removeOrganizationUsers);
    const [{loading: loadingOrgUsers, result: orgUsers}, getOrgUsers] = usePromise(Api.getOrganizationUsers);

    const FilterEmptyComponent = useCallback(
        () => {
            if(searchValue?.length < 3) {
                return <Localize>Please enter more than 3 characters to search</Localize>;
            }
            else {
                return <Localize>No result found for given input</Localize>;
            }
        }, [searchValue]);

    useEffect(() => {
        getUsers(searchValue);
    }, [getUsers, searchValue]);


    useEffect(() => {
        getOrgUsers(organization.id);
    }, [getOrgUsers, organization]);

    const organizationUsers = useMemo(() => {

        if(!orgUsers?.length) {
            return [];
        }

        return orgUsers.map(user => {
            return {
                ...user.user,
                mode: user.role,
            };
        });
    }, [orgUsers]);

    const [adminUsers, memberUsers] = useMemo(() => splitUserModes(newOrgUsers?? organizationUsers), [organizationUsers, newOrgUsers]);

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
        const userIds = formData.users.map(u => u.username);
        const removedUsers = organizationUsers?.filter(u => !userIds.includes(u.username))
            .map(u => ({user: u.username, role: u.mode}));

        try {
            await removeUsers(organization.id, removedUsers);
            await upsertUsers(organization.id, formData.users.map(u => ({user: u.username, role: u.mode})));
            Toast.show(_('Changes saved!'), Toast.SUCCESS);
        } catch(error) {
            Toast.show(getErrorMessage(error), Toast.DANGER);
            console.log(error);
        }
    }, [upsertUsers, removeUsers, organizationUsers, organization]);

    const toggleRespondMode = useCallback(() => {
        setRespondMode(!respondMode);
    }, [respondMode]);

    const renderOptionsLabel = useCallback(listProps => (
        <UserOptionLabel {...listProps} userOptions={organizationOptions} />
    ), []);

    const handleUserChange = useCallback(({value}) => {
        setNewOrgUsers(value);
    }, []);

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
                    {respondMode ? _('Respond to requests') : _('Manage Members')}
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
                            <Localize>Member Requests</Localize>
                            <span className={styles.requestNumber}>
                                {` (${pendingRequests.length})`}
                            </span>
                        </p>
                        {!!pendingRequests.length && (
                            <div className={styles.respondLink} onClick={toggleRespondMode}>
                                <Localize>Respond to all requests</Localize>
                                <BsArrowRight size={22} className={styles.rightArrowIcon} />
                            </div>
                        )}
                    </div>
                    <h5 className={styles.sectionTitle}>
                        <Localize>Add New Members</Localize>
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
                            placeholder={_('Select Users')}
                            keyExtractor={userKeyExtractor}
                            valueExtractor={userValueExtractor}
                            defaultValue={organizationUsers}
                            onChange={handleUserChange}
                            loading={loadingUsers}
                            renderOptionLabel={renderOptionsLabel}
                            renderControlLabel={UserIcon}
                            options={users?.results}
                            onInputChange={setSearchvalue}
                            FilterEmptyComponent={FilterEmptyComponent}
                            EmptyComponent={FilterEmptyComponent}
                        />
                        <Button loading={saving || removing} className={styles.saveButton}><Localize>Save</Localize></Button>
                    </Form>
                    <div className={styles.listContainer}>
                        <h5 className={styles.sectionTitle}>
                            <Localize>Admins</Localize>
                        </h5> 
                        <List
                            className={styles.userList}
                            loading={loadingOrgUsers}
                            data={adminUsers}
                            keyExtractor={keyExtractor}
                            renderItem={UserItem}
                            getOrgUsers={getOrgUsers}
                            organization={organization}
                        />
                        <h5 className={styles.sectionTitle}>
                            <Localize>Members</Localize>
                        </h5> 
                        <List
                            className={styles.userList}
                            loading={loadingOrgUsers}
                            data={memberUsers}
                            keyExtractor={keyExtractor}
                            renderItem={UserItem}
                            getOrgUsers={getOrgUsers}
                            organization={organization}
                        />
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default withVisibleCheck(ManageMembersModal);

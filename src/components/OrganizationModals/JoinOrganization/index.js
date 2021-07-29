import React, {useCallback, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';

import {MdClose} from 'react-icons/md';
import {IoIosSearch} from 'react-icons/io';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import List from '@ra/components/List';
import Modal from '@ra/components/Modal';
import TextInput from '@ra/components/Form/TextInput';
import withVisibleCheck from '@ra/components/WithVisibleCheck';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';

import {selectMyOrganizations} from 'store/selectors/organization';
import Toast from 'services/toast';
import Api from 'services/api';

import AddEditOrganizationModal from '../AddEditOrganization';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const OrganizationItem = ({item}) => {
    const {user} = useSelector(state => state.auth);
    const {memberRequests} = useSelector(state => state.organization);

    const [{loading}, requestToJoin] = usePromise(Api.requestOrganizationMember);

    const hasRequested = useMemo(() => {
        return memberRequests.some(
            req => req.user === user.id && req.organization===item.id
        );
    }, [memberRequests, user, item]);

    const handleJoinClick = useCallback(async () => {
        if(hasRequested) {
            return;
        }
        try {
            const res = await requestToJoin(item.id);
            if(res) {
                Api.getOrganizationMemberRequests();
            }
        } catch (err) {
            Toast.show(getErrorMessage(err), Toast.DANGER);
            console.log(err);
        }
    }, [item, requestToJoin, hasRequested]);

    return (
        <div className={styles.organizationItem}>
            {item.logo && <img src={item.logo} alt="Logo" className={styles.logo} />}
            <p className={styles.organizationTitle}>{item.title}</p>
            <Button 
                outline={!hasRequested}
                loading={loading} 
                onClick={handleJoinClick} 
                className={cs(styles.button, {
                    [styles.buttonRequested]: hasRequested
                })}
            >
                {!hasRequested && <BsPlus size={20} className={styles.buttonIcon} />}
                {hasRequested ? 'Requested' : 'Join'}
            </Button>
        </div>
    );
};

const JoinOrganizationModal = (props) => {
    const {onClose} = props;

    const {organizations} = useSelector(state => state.organization);
    const myOrganizations = useSelector(selectMyOrganizations);

    const [query, setQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const handleShowAddModal = useCallback(() => {
        setShowAddModal(true);
    }, []);
    const hideAddModal = useCallback(() => {
        setShowAddModal(false);
    }, []);

    const handleCloseModals = useCallback(() => {
        hideAddModal();
        onClose && onClose();
    }, [hideAddModal, onClose]);

    const handleSearchChange = useCallback(({value}) => {
        setQuery(value);
    }, []);

    const filteredOrganizations = useMemo(() => organizations.filter(org => {
        return !myOrganizations.some(el => el.id === org.id) && org.title.toLowerCase().includes(query.toLowerCase());
    })?.slice(0, 10), [myOrganizations, organizations, query]);

    if (showAddModal) {
        return (
            <AddEditOrganizationModal 
                isVisible 
                onClose={handleCloseModals}
                onGoBack={hideAddModal}
            />
        );
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Join Organization</h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p className={styles.infoText}>
                    Please choose an organization you want to join. The organization admin should accept your join invitation to be added to that organization.
                </p>
                <div className={styles.searchInput}>
                    <IoIosSearch className={styles.searchIcon} />
                    <TextInput
                        onChange={handleSearchChange}
                        className={styles.input}
                        placeholder="Search Organizations"
                    />
                </div>
                {filteredOrganizations.length ? (
                    <div className={styles.searchResults}>
                        <h5 className={styles.suggestedTitle}>
                            Suggested Organizations
                        </h5>
                        <List
                            className={styles.resultsList}
                            data={filteredOrganizations}
                            keyExtractor={keyExtractor}
                            renderItem={OrganizationItem}
                        />
                    </div>
                ) : (
                    <>
                        <p className={styles.noResults}>
                            No results found. Make sure your search is spelled correctly.
                        </p>
                        <div className={styles.addInfo}>
                            <p className={styles.addInfoText}>
                                Should this be added to NEAT+? Appeal to add an organization named ‘<span className={styles.queryTitle}>{query}</span>’. 
                            </p>
                            <Button
                                outline
                                onClick={handleShowAddModal}
                                className={styles.addButton}
                            >
                                <BsPlus size={20} className={styles.addButtonIcon} />
                                Add Organization
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default withVisibleCheck(JoinOrganizationModal);

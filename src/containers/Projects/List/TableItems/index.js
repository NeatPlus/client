import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import OptionsDropdown from 'components/OptionsDropdown';
import {PublicIcon, OrganizationIcon, PrivateIcon} from 'components/Icons';
import CreateEditProjectModal from 'components/CreateEditProjectModal';
import CloneProjectModal from 'components/CloneProjectModal';
import DeleteProjectModal from 'components/DeleteProjectModal';

import styles from './styles.scss';

export const HeaderItem = ({column}) => {
    if (column.Header === 'Options') {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column}) => {
    const [showCreateEditProjectModal, setShowCreateEditProjectModal] = useState(false);
    const [showCloneProjectModal, setShowCloneProjectModal] = useState(false);
    const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

    const handleShowCreateEditProjectModal = useCallback(
        () => setShowCreateEditProjectModal(true),
        []
    );
    const handleHideCreateEditProjectModal = useCallback(
        () => setShowCreateEditProjectModal(false),
        []
    );
    const handleShowCloneProjectModal = useCallback(
        () => setShowCloneProjectModal(true),
        []
    );
    const handleHideCloneProjectModal = useCallback(
        () => setShowCloneProjectModal(false),
        []
    );
    const handleShowDeleteProjectModal = useCallback(
        () => setShowDeleteProjectModal(true),
        []
    );
    const handleHideDeleteProjectModal = useCallback(
        () => setShowDeleteProjectModal(false),
        []
    );

    const handleEditClick = useCallback(() => {
        handleShowCreateEditProjectModal();
    }, [handleShowCreateEditProjectModal]);

    const handleCloneClick = useCallback(() => {
        handleShowCloneProjectModal();
    }, [handleShowCloneProjectModal]);

    const handleDeleteClick = useCallback(() => {
        handleShowDeleteProjectModal();
    }, [handleShowDeleteProjectModal]);

    if (column.Header === 'Name') {
        return (
            <Link to={`/projects/${item.id}/`} className={styles.nameItem}>
                {item[column.accessor]}
            </Link>
        );
    }
    if (column.Header === 'Created on') {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if (column.Header === 'Options') {
        return item.isAdminOrOwner?(
            <>
                <OptionsDropdown
                    onEdit={handleEditClick}
                    onClone={handleCloneClick}
                    onDelete={handleDeleteClick}
                />
                <CreateEditProjectModal
                    isVisible={showCreateEditProjectModal}
                    onClose={handleHideCreateEditProjectModal}
                    project={item}
                    mode='edit'
                />
                <CloneProjectModal
                    isVisible={showCloneProjectModal}
                    onClose={handleHideCloneProjectModal}
                    project={item}
                />
                <DeleteProjectModal
                    isVisible={showDeleteProjectModal}
                    onClose={handleHideDeleteProjectModal}
                    projectId={item.id}
                />
            </>
        ):null;
    }
    if (column.Header === 'Visibility') {
        const value = item[column.accessor];
        if (value === 'public') {
            return (
                <div className={styles.visibilityItem}>
                    <PublicIcon /> Public
                </div>
            );
        }
        if (value === 'public_within_organization') {
            return (
                <div className={styles.visibilityItem}>
                    <OrganizationIcon /> Public within organization
                </div>
            );
        }
        return (
            <div className={styles.visibilityItem}>
                <PrivateIcon /> Private
            </div>
        );
    }
    return item[column.accessor];
};

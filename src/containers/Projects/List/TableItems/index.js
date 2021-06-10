import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import OptionsDropdown from 'components/OptionsDropdown';
import {PublicIcon, OrganizationIcon, PrivateIcon} from 'components/Icons';
import EditProjectModal from 'components/EditProjectModal';
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
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [showCloneProjectModal, setShowCloneProjectModal] = useState(false);
    const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

    const handleShowEditProjectModal = useCallback(
        () => setShowEditProjectModal(true),
        []
    );
    const handleHideEditProjectModal = useCallback(
        () => setShowEditProjectModal(false),
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
        handleShowEditProjectModal();
    }, [handleShowEditProjectModal]);

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
        return (
            <>
                <OptionsDropdown
                    onEdit={handleEditClick}
                    onClone={handleCloneClick}
                    onDelete={handleDeleteClick}
                />
                <EditProjectModal
                    isVisible={showEditProjectModal}
                    onClose={handleHideEditProjectModal}
                    project={item}
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
        );
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

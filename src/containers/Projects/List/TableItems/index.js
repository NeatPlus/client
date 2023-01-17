import {useCallback, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';

import OptionsDropdown from 'components/OptionsDropdown';
import {PublicIcon, OrganizationIcon, PrivateIcon} from 'components/Icons';
import CreateEditProjectModal from 'components/CreateEditProjectModal';
import CloneProjectModal from 'components/CloneProjectModal';
import DeleteProjectModal from 'components/DeleteProjectModal';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import styles from './styles.scss';

export const HeaderItem = ({column}) => {
    if (column.Header === _('Options')) {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column, onAction}) => {
    const {surveys} = useSelector(state => state.survey);
    const surveyCount = useMemo(() => surveys.filter(sur => sur?.project === item.id).length || '-', [surveys, item]);

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

    const stopEventBubbling = useCallback(e => e.stopPropagation(), []);

    if (column.Header === _('Name')) {
        return (
            <div className={styles.nameItem}>
                {item[column.accessor]}
            </div>
        );
    }
    if (column.Header === _('Organization')) {
        return item[column.accessor] || '-';
    }
    if (column.Header === _('Created by')) {
        if(item[column.accessor]) {
            const {firstName, lastName} = item[column.accessor];
            return `${firstName} ${lastName}`;
        }
        return '-';
    }
    if (column.Header === _('Created on')) {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if (column.Header === _('Options')) {
        return item.isAdminOrOwner?(
            <div onClick={stopEventBubbling}>
                <OptionsDropdown
                    onEdit={handleEditClick}
                    onClone={handleCloneClick}
                    onDelete={handleDeleteClick}
                />
                <CreateEditProjectModal
                    isVisible={showCreateEditProjectModal}
                    onClose={handleHideCreateEditProjectModal}
                    project={item}
                    onComplete={onAction}
                    mode='edit'
                />
                <CloneProjectModal
                    isVisible={showCloneProjectModal}
                    onClone={onAction}
                    onClose={handleHideCloneProjectModal}
                    project={item}
                />
                <DeleteProjectModal
                    isVisible={showDeleteProjectModal}
                    onDelete={onAction}
                    onClose={handleHideDeleteProjectModal}
                    projectId={item.id}
                />
            </div>
        ):null;
    }
    if (column.Header === _('Surveys')) {
        return surveyCount;
    }
    if (column.Header === _('Visibility')) {
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
                    <OrganizationIcon /> <Localize>Public within organization</Localize>
                </div>
            );
        }
        return (
            <div className={styles.visibilityItem}>
                <PrivateIcon /> <Localize>Private</Localize>
            </div>
        );
    }
    return item[column.accessor];
};

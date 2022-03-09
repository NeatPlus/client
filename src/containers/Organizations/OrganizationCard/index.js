import {useState, useCallback} from 'react';
import {BiEditAlt, BiCog} from 'react-icons/bi';

import AddEditOrganizationModal from 'components/OrganizationModals/AddEditOrganization';
import ManageMembersModal from 'components/OrganizationModals/ManageMembers';
import {_} from 'services/i18n';

import styles from './styles.scss';

const OrganizationCard = ({item: organization}) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);

    const handleShowEditModal = useCallback(() => {
        setShowEditModal(true);
    }, []);
    const hideEditModal = useCallback(() => {
        setShowEditModal(false);
    }, []);

    const handleShowManageModal = useCallback(() => {
        setShowManageModal(true);
    }, []);
    const hideManageModal = useCallback(() => {
        setShowManageModal(false);
    }, []);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                {organization.logo && (
                    <img 
                        src={organization.logo}
                        alt="logo"
                        className={styles.logo}
                    />
                )}
                <div className={styles.title}>
                    {organization.title}
                </div>
            </div>
            <div className={styles.cardBody}>
                {organization.description}
            </div>
            <div className={styles.cardFooter}>
                <div className={styles.roleContainer}>
                    {organization.role}
                </div>
                {organization.role === 'admin' && (
                    <div className={styles.actionIcons}>
                        <div 
                            title={_('Edit')}
                            className={styles.actionIcon}
                            onClick={handleShowEditModal}
                        >
                            <BiEditAlt className={styles.icon} />
                        </div>
                        <div 
                            title={_('Manage Roles')}
                            className={styles.actionIcon}
                            onClick={handleShowManageModal}
                        >
                            <BiCog className={styles.icon} />
                        </div>
                    </div>
                )}
            </div>
            <AddEditOrganizationModal 
                editMode
                isVisible={showEditModal}
                onClose={hideEditModal}
                organization={organization}
            />
            <ManageMembersModal
                isVisible={showManageModal}
                onClose={hideManageModal}
                organization={organization}
            />
        </div>
    );
};

export default OrganizationCard;

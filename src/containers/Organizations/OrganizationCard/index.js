import {useState, useCallback} from 'react';
import {BiEditAlt, BiCog} from 'react-icons/bi';

import AddEditOrganizationModal from 'components/OrganizationModals/AddEditOrganization';

import styles from './styles.scss';

const OrganizationCard = ({item: organization}) => {
    const [showEditModal, setShowEditModal] = useState(false);

    const handleShowEditModal = useCallback(() => {
        setShowEditModal(true);
    }, []);
    const hideEditModal = useCallback(() => {
        setShowEditModal(false);
    }, []);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                {organization.logo && (
                    <img 
                        source={organization.logo}
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
                            title="Edit" 
                            className={styles.actionIcon}
                            onClick={handleShowEditModal}
                        >
                            <BiEditAlt className={styles.icon} />
                        </div>
                        <div 
                            title="Manage Roles" 
                            className={styles.actionIcon}
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
        </div>
    );
};

export default OrganizationCard;

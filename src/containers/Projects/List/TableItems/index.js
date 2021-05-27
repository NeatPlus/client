import {useCallback} from 'react';
import {Link} from 'react-router-dom';

import OptionsDropdown from 'components/OptionsDropdown';
import {PublicIcon, OrganizationIcon, PrivateIcon} from 'components/Icons';

import styles from './styles.scss';

export const HeaderItem = ({column}) => {
    if(column.Header==='Options') {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column}) => {
    const handleEditClick = useCallback(() => {
        // TODO: Edit Functionality
    }, []);

    const handleCloneClick = useCallback(() => {
        // TODO: Clone Functionality
    }, []);

    const handleDeleteClick = useCallback(() => {
        // TODO: Delete Functionality
    }, []);

    if(column.Header==='Name') {
        return (
            <Link 
                to={`/projects/${item.id}/`} 
                className={styles.nameItem}
            >
                {item[column.accessor]}
            </Link>
        );
    }
    if(column.Header==='Created on') {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if(column.Header==='Options') {
        return <OptionsDropdown onEdit={handleEditClick} onClone={handleCloneClick} onDelete={handleDeleteClick} />;
    }
    if(column.Header==='Visibility') {
        const value = item[column.accessor];
        if(value==='public') {
            return (
                <div className={styles.visibilityItem}>
                    <PublicIcon /> Public
                </div>
            );
        }
        if(value==='public_within_organization') {
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

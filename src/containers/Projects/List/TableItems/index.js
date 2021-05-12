import {useCallback} from 'react';
import {useHistory} from 'react-router-dom';

import {BsThreeDots} from 'react-icons/bs';
import {BiEditAlt, BiTrash, BiCopy} from 'react-icons/bi';
import {IoEyeOutline, IoEye} from 'react-icons/io5';
import {MdLockOutline} from 'react-icons/md';

import Dropdown from '@ra/components/Dropdown';

import cs from '@ra/cs';

import styles from './styles.scss';

const PublicIcon = () => (
    <IoEyeOutline 
        size={20} 
        className={cs(styles.visibilityIcon, styles.iconPublic)} 
    />
);
const OrganizationIcon = () => (
    <IoEye // FIXME: Use icon from design
        size={20} 
        className={cs(styles.visibilityIcon, styles.iconPublic)} 
    />
);
const PrivateIcon = () => (
    <MdLockOutline 
        size={20} 
        className={cs(styles.visibilityIcon, styles.iconPrivate)} 
    />
);

const OptionsIcon = () => <BsThreeDots size={22} className={styles.menuIcon} />;

export const HeaderItem = ({column}) => {
    if(column.Header==='Options') {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column}) => {
    const history = useHistory();

    const handleEditClick = useCallback(() => {
        history.push(`/projects/${item.id}/`);
    }, [history, item]);

    if(column.Header==='Name') {
        return <span className={styles.nameItem}>{item[column.accessor]}</span>;
    }
    if(column.Header==='Options') {
        return (
            <Dropdown align="right" renderLabel={OptionsIcon} labelContainerClassName={styles.menuIconContainer}>
                <ul className={styles.projectControls}>
                    <li className={styles.projectControlItem} onClick={handleEditClick}>
                        <BiEditAlt size={20} className={styles.controlIcon} /> Edit
                    </li>
                    <li className={styles.projectControlItem}>
                        <BiCopy size={20} className={styles.controlIcon} /> Clone
                    </li> 
                    <li className={styles.projectControlItem}>
                        <BiTrash size={20} className={styles.controlIcon} /> Delete
                    </li>
                </ul>
            </Dropdown>
        );
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
        if(value==='public_organization') {
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

import {BsThreeDots} from 'react-icons/bs';
import {IoEyeOutline, IoEye} from 'react-icons/io5';
import {MdLockOutline} from 'react-icons/md';

import cs from '@ra/cs';

import styles from './styles.scss';

export const PublicIcon = () => (
    <IoEyeOutline 
        size={20} 
        className={cs(styles.visibilityIcon, styles.iconPublic)} 
    />
);

export const OrganizationIcon = () => (
    <IoEye // FIXME: Use icon from design
        size={20} 
        className={cs(styles.visibilityIcon, styles.iconPublic)} 
    />
);

export const PrivateIcon = () => (
    <MdLockOutline 
        size={20} 
        className={cs(styles.visibilityIcon, styles.iconPrivate)} 
    />
);

export const OptionsIcon = () => (
    <BsThreeDots size={22} className={styles.menuIcon} />
);


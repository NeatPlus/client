import {BiEditAlt, BiTrash, BiCopy} from 'react-icons/bi';
import {OptionsIcon} from 'components/Icons';
import Dropdown from '@ra/components/Dropdown';

import styles from './styles.scss';

const OptionsDropdown = ({className, onEdit, onClone, onDelete}) => {
    return (
        <Dropdown 
            className={className} 
            align="right" 
            renderLabel={OptionsIcon} 
            labelContainerClassName={styles.menuIconContainer}
        >
            <ul className={styles.projectControls}>
                {onEdit && (
                    <li className={styles.projectControlItem} onClick={onEdit}>
                        <BiEditAlt size={20} className={styles.controlIcon} /> Edit
                    </li>
                )}
                {onClone && (
                    <li className={styles.projectControlItem} onClick={onClone}>
                        <BiCopy size={20} className={styles.controlIcon} /> Clone
                    </li>
                )}
                {onDelete && (
                    <li className={styles.projectControlItem} onClick={onDelete}>
                        <BiTrash size={20} className={styles.controlIcon} /> Delete
                    </li>
                )}
            </ul>
        </Dropdown>
    );
};

export default OptionsDropdown;

import {BiEditAlt, BiTrash, BiCopy} from 'react-icons/bi';
import {OptionsIcon} from 'components/Icons';
import Dropdown from '@ra/components/Dropdown';
import {Localize} from '@ra/components/I18n';

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
                        <BiEditAlt size={20} className={styles.controlIcon} /> <Localize>Edit</Localize>
                    </li>
                )}
                {onClone && (
                    <li className={styles.projectControlItem} onClick={onClone}>
                        <BiCopy size={20} className={styles.controlIcon} /> <Localize>Clone</Localize>
                    </li>
                )}
                {onDelete && (
                    <li className={styles.projectControlItem} onClick={onDelete}>
                        <BiTrash size={20} className={styles.controlIcon} /> <Localize>Delete</Localize>
                    </li>
                )}
            </ul>
        </Dropdown>
    );
};

export default OptionsDropdown;

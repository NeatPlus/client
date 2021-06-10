import {useCallback} from 'react';
import {
    IoMdCheckbox, 
    IoMdSquareOutline
} from 'react-icons/io';

import cs from '@ra/cs';

import styles from './styles.scss';

const BooleanInput = ({onChange, answer}) => {
    const handleChange = useCallback(() => {
        onChange && onChange({
            value: answer==='true' ? 'false' : 'true',
        });
    }, [onChange, answer]);

    return (
        <div className={styles.input} onClick={handleChange}>
            {answer === 'true' 
                ? <IoMdCheckbox className={cs(styles.icon, styles.iconChecked)} />
                : <IoMdSquareOutline className={styles.icon} />
            }
        </div>
    );
};

export default BooleanInput;

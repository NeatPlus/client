import {useCallback} from 'react';
import {
    IoMdRadioButtonOn, 
    IoMdRadioButtonOff, 
    IoMdCheckbox, 
    IoMdSquareOutline
} from 'react-icons/io';

import cs from '@ra/cs';

import styles from './styles.scss';

const Option = ({option, checked, setChecked, multiple}) => {
    const handleChangeAnswer = useCallback(() => setChecked(option), [option, setChecked]);

    return (
        <div className={cs(styles.optionContent, {
            [styles.optionContentChecked]: checked,
        })} onClick={handleChangeAnswer}>
            {multiple
                ? checked
                    ? <IoMdCheckbox className={styles.leftIcon} />
                    : <IoMdSquareOutline className={styles.leftIcon} />
                : checked 
                    ? <IoMdRadioButtonOn className={styles.leftIcon} /> 
                    : <IoMdRadioButtonOff className={styles.leftIcon} />
            }
            <div className={styles.rightContent}>
                <div className={styles.option}>
                    {option.title}
                </div>
            </div>
        </div>

    );
};

export default Option;

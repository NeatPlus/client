import {useCallback} from 'react';
import {IoMdRadioButtonOn, IoMdRadioButtonOff} from 'react-icons/io';

import cs from '@ra/cs';
import Label from '@ra/components/Form/Label';

import styles from './styles.scss';

const RadioInput = props => {
    const {
        value,
        size=18,
        checked, 
        onCheck, 
        label, 
        className, 
        radioClassName, 
        radioCheckedClassName, 
        labelClassName
    } = props;

    const handleClick = useCallback(() => {
        onCheck && onCheck(value);
    }, [value, onCheck]);

    return (
        <div className={cs(className, styles.container)} onClick={handleClick}>
            {checked 
                ? <IoMdRadioButtonOn size={size} className={cs(radioCheckedClassName, styles.radioChecked)} />
                : <IoMdRadioButtonOff size={size} className={cs(radioClassName, styles.radio)} />
            }
            {!!label && <Label className={cs(labelClassName, styles.label)}>{label}</Label>}
        </div>
    );
};

export default RadioInput;

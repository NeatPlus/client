import {useCallback} from 'react';

import RadioInput from '../RadioInput';
import styles from './styles.scss';

const BooleanInput = ({onChange, answer}) => {
    const handleSetTrue = useCallback(() => {
        onChange && onChange({value: 'true'});
    }, [onChange]);

    const handleSetFalse = useCallback(() => {
        onChange && onChange({value: 'false'});
    }, [onChange]);

    return (
        <div className={styles.radioInputs}>
            <RadioInput 
                onCheck={handleSetTrue} 
                className={styles.radioInput} 
                value="yes" 
                label="Yes" 
                checked={answer==='true'}
            />
            <RadioInput 
                onCheck={handleSetFalse} 
                className={styles.radioInput} 
                value="no" 
                label="No" 
                checked={answer==='false'}
            />
        </div>
    );
};

export default BooleanInput;

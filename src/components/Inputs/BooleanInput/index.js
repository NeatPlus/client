import {useState, useCallback} from 'react';

import RadioInput from '../RadioInput';
import styles from './styles.scss';

const BooleanInput = () => {
    const [isTrue, setIsTrue] = useState(true);

    const handleSetTrue = useCallback(() => setIsTrue(true), []);
    const handleSetFalse = useCallback(() => setIsTrue(false), []);

    return (
        <div className={styles.radioInputs}>
            <RadioInput 
                onCheck={handleSetTrue} 
                className={styles.radioInput} 
                value="yes" 
                label="Yes" 
                checked={isTrue}
            />
            <RadioInput 
                onCheck={handleSetFalse} 
                className={styles.radioInput} 
                value="no" 
                label="No" 
                checked={!isTrue}
            />
        </div>
    );
};

export default BooleanInput;

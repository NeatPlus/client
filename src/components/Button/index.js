import Loader from 'components/Loader';
import Button from '@ra/components/Button';
import cs from '@ra/cs';

import styles from './styles.scss';

const _Button = props => {
    const {
        className, 
        disabled, 
        secondary, 
        outline,
        loading,
        children,
        ...buttonProps
    } = props;

    return (
        <Button 
            className={cs(
                className, 
                styles.button, 
                {[styles.buttonDisabled]: disabled || loading},
                {[styles.buttonSecondary]: secondary},
                {[styles.buttonOutline]: outline},
            )} 
            disabled={disabled}
            {...buttonProps} 
        >
            {children}
            {loading && (
                <div className={styles.loader}>
                    <Loader color={outline ? '#00a297' : '#fff'} />
                </div>
            )}
        </Button>
    );
};

export default _Button;

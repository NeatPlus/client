import Button from '@ra/components/Button';
import cs from '@ra/cs';

import styles from './styles.scss';

const _Button = props => {
    const {className, disabled, ...buttonProps} = props;

    return (
        <Button className={cs(className, styles.button, {[styles.buttonDisabled]: disabled})} disabled={disabled} {...buttonProps} />
    );
};

export default _Button;
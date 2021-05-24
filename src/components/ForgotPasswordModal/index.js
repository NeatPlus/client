import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';

import styles from './styles.scss';

const ForgotPasswordModal = (props) => {
    const {isVisible, onClose, showEnterCodeModal} = props;
    const [inputData, setInputData] = useState({
        email: '',
    });

    const handleChange = useCallback(
        ({name, value}) =>
            setInputData({
                ...inputData,
                [name]: value,
            }),
        [inputData]
    );

    const closeThisModal = useCallback(() => {
        onClose();
        setInputData({
            email: '',
        });
    }, [onClose]);

    const showECM = useCallback(() => {
        onClose();
        showEnterCodeModal();
        setInputData({
            email: '',
        });
    }, [onClose, showEnterCodeModal]);

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Forgot Password?</h2>
                <div className={styles.closeContainer} onClick={closeThisModal}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p>We will send a code to your email to reset your password.</p>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Email</Label>
                    <Input
                        type='email'
                        name='email'
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.buttons}>
                    <Link to='#' onClick={closeThisModal}>
                        Return to Log in
                    </Link>
                    <Button onClick={showECM}>Continue</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ForgotPasswordModal;

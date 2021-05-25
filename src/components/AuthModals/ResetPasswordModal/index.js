import {useCallback, useState} from 'react';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';

import styles from './styles.scss';


const ResetPasswordModal = (props) => {
    const {isVisible, onClose} = props;
    const [inputData, setInputData] = useState({
        newPassword: '',
        verifyNewPassword: '',
    });

    const closeThisModal = useCallback(() => {
        onClose();
        setInputData({
            newPassword: '',
            verifyPassword: '',
        });
    }, [onClose]);

    const handleChange = useCallback(
        ({name, value}) =>
            setInputData({
                ...inputData,
                [name]: value,
            }),
        [inputData]
    );

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Reset Password</h2>
                <div className={styles.closeContainer} onClick={closeThisModal}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p>Please set a new password for your account</p>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>New Password</Label>
                    <Input
                        type='password'
                        name='newPassword'
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>
                        Verify New Password
                    </Label>
                    <Input
                        type='password'
                        name='verifyNewPassword'
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.button}>
                    <Button>Set Password</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ResetPasswordModal;

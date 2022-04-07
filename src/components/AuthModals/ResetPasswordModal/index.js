import {useCallback, useState} from 'react';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import withVisibleCheck from '@ra/components/WithVisibleCheck';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import useRequest from 'hooks/useRequest';
import Toast from 'services/toast';

import styles from './styles.scss';

const ResetPasswordModal = (props) => {
    const {onClose, email, identifier} = props;
    const [inputData, setInputData] = useState({
        newPassword: '',
        verifyNewPassword: '',
    });
    const [error, setError] = useState(null);

    const [{loading}, resetPassword] = useRequest(
        '/user/password_reset/change/',
        {
            method: 'POST',
        }
    );

    const handleChange = useCallback(
        ({name, value}) =>
            setInputData({
                ...inputData,
                [name]: value,
            }),
        [inputData]
    );

    const handlePasswordReset = useCallback(async () => {
        setError(null);
        if(inputData.newPassword !== inputData.verifyNewPassword) {
            return Toast.show(_('Passwords do not match'), Toast.DANGER);
        }
        try {
            const result = await resetPassword({
                username: email,
                identifier,
                password: inputData.newPassword,
                rePassword: inputData.verifyNewPassword,
            });
            if (result) {
                onClose();
                Toast.show(_('Password Reset Successfull!'), Toast.SUCCESS);
            }
        } catch (err) {
            setError(err);
            Toast.show(
                err?.error || err?.errors?.[0] || _('Invalid Password'),
                Toast.DANGER
            );
        }
    }, [
        onClose,
        email,
        identifier,
        resetPassword,
        inputData.newPassword,
        inputData.verifyNewPassword,
    ]);

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Reset Password</Localize></h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p><Localize>Please set a new password for your account</Localize></p>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>New Password</Label>
                    <Input
                        type='password'
                        name='newPassword'
                        onChange={handleChange}
                        className={styles.input}
                        errorMessage={error?.password}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>
                        <Localize>Verify New Password</Localize>
                    </Label>
                    <Input
                        type='password'
                        name='verifyNewPassword'
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.button}>
                    <Button loading={loading} onClick={handlePasswordReset}>
                        <Localize>Set Password</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default withVisibleCheck(ResetPasswordModal);

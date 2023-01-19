import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

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
import {getErrorMessage} from '@ra/utils/error';

import styles from './styles.scss';

const ForgotPasswordModal = (props) => {
    const {onClose, handleShowCode, setEmail} = props;
    const [inputData, setInputData] = useState({
        email: '',
    });
    const [{loading}, resetPassword] = useRequest('/user/password_reset/', {
        method: 'POST',
    });

    const {isAuthenticated} = useSelector(state => state.auth);

    const handleChange = useCallback(
        ({name, value}) =>
            setInputData({
                ...inputData,
                [name]: value,
            }),
        [inputData]
    );

    const handleSumbitEmail = useCallback(async () => {
        try {
            if(!inputData.email) {
                return Toast.show(_('Email is required!'), Toast.DANGER);
            }
            const result = await resetPassword({
                username: inputData.email,
            });
            if (result) {
                setEmail(inputData.email);
                onClose();
                handleShowCode();
            }
        } catch (err) {
            Toast.show(getErrorMessage(err) || _('Invalid Email!'), Toast.DANGER);
        }
    }, [
        onClose,
        inputData.email,
        resetPassword,
        handleShowCode,
        setEmail,
    ]);

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Forgot Password?</Localize></h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p><Localize>We will send a code to your email to reset your password.</Localize></p>
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
                    {!isAuthenticated && (
                        <Link to='#' onClick={onClose}>
                            <Localize>Return to Log in</Localize>
                        </Link>
                    )}
                    <Button className={styles.continueButton} loading={loading} onClick={handleSumbitEmail}>
                        <Localize>Continue</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default withVisibleCheck(ForgotPasswordModal);

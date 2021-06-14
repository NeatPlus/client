import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import {MdClose, MdKeyboardArrowLeft} from 'react-icons/md';

import OTPInput from 'components/Inputs/OtpInput';
import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import withVisibleCheck from '@ra/components/WithVisibleCheck';

import useRequest from 'hooks/useRequest';
import Toast from 'services/toast';

import styles from './styles.scss';

const EnterCodeModal = (props) => {
    const {
        onClose,
        showResetPasswordModal,
        showForgotPasswordModal,
        email,
        setIdentifier,
    } = props;

    const [otpData, setOtpData] = useState({otpCode: ''});
    const [, resetPassword] = useRequest('/user/password_reset/', {
        method: 'POST',
    });
    const [{loading}, verifyPassword] = useRequest(
        '/user/password_reset/verify/',
        {
            method: 'POST',
        }
    );

    const handleOtpChange = useCallback(
        (otp) =>
            setOtpData({
                ...otpData,
                otpCode: otp,
            }),
        [otpData]
    );

    const showFPM = useCallback(() => {
        onClose();
        showForgotPasswordModal();
    }, [onClose, showForgotPasswordModal]);

    const showRPM = useCallback(() => {
        onClose();
        showResetPasswordModal();
    }, [onClose, showResetPasswordModal]);

    const handleVerifyPassword = useCallback(async () => {
        try {
            const result = await verifyPassword({
                username: email,
                pin: parseInt(otpData.otpCode),
            });
            if (result) {
                setIdentifier(result.identifier);
                showRPM();
            }
        } catch (err) {
            Toast.show(err?.error || 'Invalid Code !', Toast.DANGER);
        }
    }, [otpData.otpCode, showRPM, verifyPassword, email, setIdentifier]);

    const handleResendCode = useCallback(async () => {
        try {
            const result = await resetPassword({
                username: email,
            });
            if (result) {
                Toast.show(
                    'Successfully resent confirmation mail!',
                    Toast.SUCCESS
                );
            }
        } catch (err) {
            Toast.show(err?.error || 'An error occured!', Toast.DANGER);
        }
    }, [email, resetPassword]);

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <MdKeyboardArrowLeft
                        size={30}
                        onClick={showFPM}
                        className={styles.arrowIcon}
                    />
                    <h2 className={styles.title}>OK, You got a code</h2>
                </div>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p>
                    Enter a verification code we just sent to your email address
                </p>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Enter the code</Label>
                    <OTPInput
                        autoFocus
                        isNumberInput
                        length={6}
                        className={styles.otpContainer}
                        inputClassName={styles.otpInput}
                        onChangeOTP={handleOtpChange}
                    />
                </div>
                <p className={styles.resend}>
                    Didn't get a code?
                    <Link to='#' onClick={handleResendCode}>
                        {' Resend'}
                    </Link>
                </p>
                <div className={styles.button}>
                    <Button loading={loading} onClick={handleVerifyPassword}>
                        Done
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default withVisibleCheck(EnterCodeModal);

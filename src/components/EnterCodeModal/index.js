import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import {MdClose} from 'react-icons/md';
import {MdKeyboardArrowLeft} from 'react-icons/md';

import OTPInput from 'components/OtpInput';
import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';

import styles from './styles.scss';

const EnterCodeModal = (props) => {
    const {
        isVisible,
        onClose,
        showResetPasswordModal,
        backToForgotPasswordModal,
    } = props;
    const [otpData, setOtpData] = useState({otpCode: ''});

    const handleOtpChange = useCallback(
        (otp) =>
            setOtpData({
                ...otpData,
                otpCode: otp,
            }),
        [otpData]
    );

    const closeThisModal = useCallback(() => {
        onClose();
        setOtpData({
            otpCode: '',
        });
    }, [onClose]);

    const backToFPM = useCallback(() => {
        onClose();
        backToForgotPasswordModal();
        setOtpData({
            otpCode: '',
        });
    }, [onClose, backToForgotPasswordModal]);

    const showRPM = useCallback(() => {
        onClose();
        showResetPasswordModal();
        setOtpData({
            otpCode: '',
        });
    }, [onClose, showResetPasswordModal]);

    if (!isVisible) {
        return null;
    }
    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <MdKeyboardArrowLeft
                        size={30}
                        onClick={backToFPM}
                        className={styles.arrowIcon}
                    />
                    <h2 className={styles.title}>OK, You got a code</h2>
                </div>
                <div className={styles.closeContainer} onClick={closeThisModal}>
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
                        onChangeOTP={(otp) => handleOtpChange(otp)}
                    />
                </div>
                <p className={styles.resend}>
                    {' '}
                    Didn't get a code?
                    <Link to='#'> Resend</Link>
                </p>
                <div className={styles.button}>
                    <Button onClick={showRPM}>Done</Button>
                </div>
            </div>
        </Modal>
    );
};

export default EnterCodeModal;

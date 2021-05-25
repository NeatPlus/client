import {useCallback, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import OTPInput from 'components/OtpInput';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';

import useRequest from 'hooks/useRequest';

import styles from './styles.scss';

const VerifyEmailModal = (props) => {
    const {isVisible, onClose, onComplete, username} = props;
    
    const history = useHistory();

    const [otpData, setOtpData] = useState({otpCode: ''});
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    const [, resendCode] = useRequest('/user/email_confirm/', {method: 'POST'});
    const [, verifyEmail] = useRequest('/user/email_confirm/verify/', {method: 'POST'});

    const handleOtpChange = useCallback(
        (otp) =>
            setOtpData({
                ...otpData,
                otpCode: otp,
            }),
        [otpData]
    );

    const handleResendCode = useCallback(async () => {
        setInfo(null);
        setError(null);
        try {
            await resendCode({username});
            setInfo('Successfully resent confirmation mail!');
        } catch(err) {
            setError('An error occured while sending email. Please try again!');
            console.log(err);    
        }
    }, [resendCode, username]);

    const handleSubmitCode = useCallback(async () => {
        setInfo(null);
        setError(null);
        try {
            await verifyEmail({username, pin: otpData.otpCode});
            await onComplete();
            history.push('/projects/');
        } catch(err) {
            setError(err?.error || 'Could not verify email!');
            console.log(err);
        }
    }, [verifyEmail, otpData, username, history, onComplete]);

    const closeThisModal = useCallback(() => {
        setOtpData({
            otpCode: '',
        });
        onClose();
    }, [onClose]);

    if (!isVisible) {
        return null;
    }
    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Verify your email</h2>
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
                    <Link to='#' onClick={handleResendCode}> Resend</Link>
                </p>
                {!!info && <p className={styles.info}>{info}</p>}
                {!!error && <p className={styles.error}>{error}</p>}
                <div className={styles.button}>
                    <Button disabled={otpData.otpCode?.length!==6} onClick={handleSubmitCode}>Done</Button>
                </div>
            </div>
        </Modal>
    );
};

export default VerifyEmailModal;

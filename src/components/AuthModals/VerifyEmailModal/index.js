import {useCallback, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import OTPInput from 'components/Inputs/OtpInput';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import Api from 'services/api';
import usePromise from '@ra/hooks/usePromise';

import styles from './styles.scss';

const VerifyEmailModal = (props) => {
    const {
        isVisible, 
        onClose, 
        onComplete, 
        username, 
        email,
        password,
        mode='confirm',
    } = props;
    
    const navigate = useNavigate();

    const [otpData, setOtpData] = useState({otpCode: ''});
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    const [{loading: loadingCode}, resendCode] = usePromise(
        mode==='change' ? Api.requestEmailChange : Api.resendConfirmEmail
    );
    const [{loading: loadingEmail}, verifyEmail] = usePromise(
        mode==='change' ? Api.verifyEmailChange : Api.verifyEmail
    );

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
            await resendCode(mode==='change' ? {newEmail: email, password} : {username});
            setError(null);
            setInfo(_('Successfully resent confirmation mail!'));
        } catch(err) {
            setError(err?.error || _('An error occured while sending email. Please try again!'));
            console.log(err);    
        }
    }, [resendCode, email, mode, username, password]);

    const handleSubmitCode = useCallback(async () => {
        setInfo(null);
        setError(null);
        try {
            const params = {username, pin: otpData.otpCode};
            if(mode==='change') {
                delete params.username;
            }
            await verifyEmail(params);
            await onComplete();
            setError(null);
            navigate('/projects/');
        } catch(err) {
            setError(err?.error || _('Could not verify email!'));
            console.log(err);
        }
    }, [verifyEmail, otpData, username, navigate, onComplete, mode]);

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
                <h2 className={styles.title}><Localize>Verify your email</Localize></h2>
                <div className={styles.closeContainer} onClick={closeThisModal}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p>
                    <Localize>Enter a verification code we just sent to your email address</Localize>
                </p>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}><Localize>Enter the code</Localize></Label>
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
                    <Localize>Didn't get a code?</Localize>
                    <Link to='#' onClick={handleResendCode}> <Localize>Resend</Localize></Link>
                </p>
                {!!info && <p className={styles.info}>{info}</p>}
                {!!error && <p className={styles.error}>{error}</p>}
                <div className={styles.button}>
                    <Button 
                        loading={loadingCode || loadingEmail}
                        disabled={otpData.otpCode?.length!==6} 
                        onClick={handleSubmitCode}
                    >
                        <Localize>Done</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default VerifyEmailModal;

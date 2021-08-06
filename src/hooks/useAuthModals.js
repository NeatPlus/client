import {useState, useCallback} from 'react';

const useAuthModals = () => {
    const [modals, setModals] = useState({
        showCodeModal: false,
        showForgotPasswordModal: false,
        showResetPasswordModal: false,
        showVerifyEmailModal: false,
        showConfirmPasswordModal: false,
    });

    const [email, setEmail] = useState('');
    const [identifier, setIdentifier] = useState('');

    const handleShowCode = useCallback(() => {
        setModals({
            showCodeModal: true,
            showForgotPasswordModal: false,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
            showConfirmPasswordModal: false,
        });
    }, []);

    const handleShowForgotPassword = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: true,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
            showConfirmPasswordModal: false,
        });
    }, []);

    const handleShowResetPassword = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: false,
            showResetPasswordModal: true,
            showVerifyEmailModal: false,
            showConfirmPasswordModal: false,
        });
    }, []);

    const handleShowVerifyEmail = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: false,
            showResetPasswordModal: false,
            showVerifyEmailModal: true,
            showConfirmPasswordModal: false,
        });
    }, []);

    const handleShowConfirmPassword = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: false,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
            showConfirmPasswordModal: true,
        });
    }, []);

    const hideModals = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: false,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
            showConfirmPasswordModal: false,
        });
    }, []);

    return {
        modals,
        handleShowCode,
        handleShowForgotPassword,
        handleShowResetPassword,
        handleShowVerifyEmail,
        handleShowConfirmPassword,
        hideModals,
        email,
        setEmail,
        identifier,
        setIdentifier,
    };
};

export default useAuthModals;

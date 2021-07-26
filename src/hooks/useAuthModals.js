import {useState, useCallback} from 'react';

const useAuthModals = () => {
    const [modals, setModals] = useState({
        showCodeModal: false,
        showForgotPasswordModal: false,
        showResetPasswordModal: false,
        showVerifyEmailModal: false,
    });

    const [email, setEmail] = useState('');
    const [identifier, setIdentifier] = useState('');

    const handleShowCode = useCallback(() => {
        setModals({
            showCodeModal: true,
            showForgotPasswordModal: false,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
        });
    }, []);

    const handleShowForgotPassword = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: true,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
        });
    }, []);

    const handleShowResetPassword = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: false,
            showResetPasswordModal: true,
            showVerifyEmailModal: false,
        });
    }, []);

    const handleShowVerifyEmail = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: false,
            showResetPasswordModal: false,
            showVerifyEmailModal: true,
        });
    }, []);

    const hideModals = useCallback(() => {
        setModals({
            showCodeModal: false,
            showForgotPasswordModal: false,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
        });
    }, []);

    return {
        modals,
        handleShowCode,
        handleShowForgotPassword,
        handleShowResetPassword,
        handleShowVerifyEmail,
        hideModals,
        email,
        setEmail,
        identifier,
        setIdentifier,
    };
};

export default useAuthModals;

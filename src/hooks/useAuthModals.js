import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';

const useAuthModals= () => {
    const [modals, setModals] = useState({
        showCodeModal: false,
        showForgotPasswordModal: false,
        showResetPasswordModal: false,
        showVerifyEmailModal: false,
    });

    const {isAuthenticated} = useSelector(state => state.auth);

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
            showForgotPasswordModal: !isAuthenticated && true,
            showResetPasswordModal: false,
            showVerifyEmailModal: false,
        });
    }, [isAuthenticated]);

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
    };
};

export default useAuthModals;

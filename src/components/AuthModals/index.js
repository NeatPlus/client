import EnterCodeModal from './EnterCodeModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ResetPasswordModal from './ResetPasswordModal';
import VerifyEmailModal from './VerifyEmailModal';

const AuthModals = ({
    modals: {
        showCodeModal,
        showForgotPasswordModal,
        showResetPasswordModal,
        showVerifyEmailModal,
    }, 
    handleShowCode,
    handleShowForgotPassword,
    handleShowResetPassword,
    handleShowVerifyEmail,
    hideModals,
    username,
    onRegisterComplete,
}) => {
    return (
        <>
            <EnterCodeModal isVisible={showCodeModal} onClose={hideModals} />
            <ForgotPasswordModal isVisible={showForgotPasswordModal} onClose={hideModals} />
            <ResetPasswordModal isVisible={showResetPasswordModal} onClose={hideModals} />
            <VerifyEmailModal onComplete={onRegisterComplete} username={username} isVisible={showVerifyEmailModal} onClose={hideModals} />
        </>
    );
};

export default AuthModals;

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
    email,
    setEmail,
    identifier,
    setIdentifier,
}) => {
    return (
        <>
            <EnterCodeModal
                isVisible={showCodeModal}
                onClose={hideModals}
                showForgotPasswordModal={handleShowForgotPassword}
                showResetPasswordModal={handleShowResetPassword}
                email={email}
                setIdentifier={setIdentifier}
            />
            <ForgotPasswordModal
                isVisible={showForgotPasswordModal}
                onClose={hideModals}
                handleShowCode={handleShowCode}
                setEmail={setEmail}
            />
            <ResetPasswordModal
                isVisible={showResetPasswordModal}
                onClose={hideModals}
                email={email}
                identifier={identifier}
            />
            <VerifyEmailModal
                onComplete={onRegisterComplete}
                username={username}
                isVisible={showVerifyEmailModal}
                onClose={hideModals}
            />
        </>
    );
};

export default AuthModals;

import EnterCodeModal from './EnterCodeModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ResetPasswordModal from './ResetPasswordModal';
import VerifyEmailModal from './VerifyEmailModal';
import ConfirmPasswordModal from './ConfirmPasswordModal';

const AuthModals = ({
    modals: {
        showCodeModal,
        showForgotPasswordModal,
        showResetPasswordModal,
        showVerifyEmailModal,
        showConfirmPasswordModal,
    },
    handleShowCode,
    handleShowForgotPassword,
    handleShowResetPassword,
    handleShowVerifyEmail,
    hideModals,
    username,
    onRegisterComplete,
    password,
    email,
    setEmail,
    identifier,
    setIdentifier,
    onSubmit,
    loading,
    verifyMode,
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
                mode={verifyMode}
                email={email}
                password={password}
                onComplete={onRegisterComplete}
                username={username}
                isVisible={showVerifyEmailModal}
                onClose={hideModals}
            />
            <ConfirmPasswordModal
                isVisible={showConfirmPasswordModal}
                onClose={hideModals}
                onSubmit={onSubmit}
                loading={loading}
            />
        </>
    );
};

export default AuthModals;

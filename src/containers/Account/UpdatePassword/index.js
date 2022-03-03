import {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import AuthModals from 'components/AuthModals';
import Form, {InputField} from '@ra/components/Form';
import {SecureTextInput} from '@ra/components/Form/inputs';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import cs from '@ra/cs';
import Toast from 'services/toast';
import useRequest from 'hooks/useRequest';
import useAuthModals from 'hooks/useAuthModals';
import {logout} from 'store/actions/auth';
import {getErrorMessage} from '@ra/utils/error';

import AccountPanel from '../AccountInfo';
import styles from './styles.scss';

const UpdatePassword = () => {
    const authModalsConfig = useAuthModals();
    const history = useHistory();
    const dispatch = useDispatch();

    const [{loading}, updatePassword] = useRequest(
        '/user/me/change_password/',
        {method: 'POST'}
    );

    const handleSubmit = useCallback(
        async (formData) => {
            const {oldPassword, newPassword, reNewPassword} = formData;
            if (newPassword !== reNewPassword) {
                return Toast.show(_('Password Did Not Match!'), Toast.DANGER);
            }
            if (oldPassword === newPassword) {
                return Toast.show(
                    _('New password cannot be same as old password!'), 
                    Toast.DANGER
                );
            }
            try {
                if (newPassword === reNewPassword) {
                    const result = await updatePassword({
                        oldPassword,
                        newPassword,
                        reNewPassword,
                    });
                    if (result) {
                        Toast.show(result.detail, Toast.SUCCESS);
                        dispatch(logout());
                        history.push('/login');
                    }
                }
            } catch (err) {
                let errorMessage = getErrorMessage(err);
                if(err?.code === 'user_inactive') {
                    errorMessage = _('Please make sure the current password is correct!');
                }
                Toast.show(errorMessage, Toast.DANGER);
                console.log(err);
            }
        },
        [dispatch, history, updatePassword]
    );

    return (
        <>
            <Form className={styles.container} onSubmit={handleSubmit}>
                <AccountPanel loading={loading} actionTitle={_('Update Password')} />
                <h1 className={styles.changePassword}><Localize>Change Password?</Localize></h1>
                <InputField
                    name='oldPassword'
                    required
                    component={SecureTextInput}
                    className={styles.input}
                    label={_('Current Password')}
                    labelClassName={styles.inputLabel}
                    containerClassName={cs(styles.inputGroup, styles.inputGroupInfo)}
                />
                <div
                    className={styles.forgotPasswordLink}
                    onClick={authModalsConfig.handleShowForgotPassword}
                >
                    <Localize>Forgot Password?</Localize>
                </div>
                <InputField
                    name='newPassword'
                    required
                    component={SecureTextInput}
                    className={styles.input}
                    label={_('New Password')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                />
                <InputField
                    name='reNewPassword'
                    required
                    component={SecureTextInput}
                    className={styles.input}
                    label={_('Verify New Password')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                />
            </Form>
            <AuthModals {...authModalsConfig} />
        </>
    );
};

export default UpdatePassword;

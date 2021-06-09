import {useCallback, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import Form, {InputField} from '@ra/components/Form';
import {SecureTextInput} from '@ra/components/Form/inputs';

import Toast from 'services/toast';
import useRequest from 'hooks/useRequest';
import {logout} from 'store/actions/auth';

import AccountPanel from '../AccountInfo';
import styles from './styles.scss';

const UpdatePassword = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    const [{loading}, updatePassword] = useRequest(
        '/user/me/change_password/',
        {method: 'POST'}
    );

    const handleSubmit = useCallback(
        async (formData) => {
            setError(null);
            const {oldPassword, newPassword, reNewPassword} = formData;

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

                if (newPassword !== reNewPassword) {
                    Toast.show('Password Did Not Match !!', Toast.DANGER);
                }
            } catch (err) {
                setError(err);
                Toast.show('Incorrect old password !!', Toast.DANGER);
            }
        },
        [dispatch, history, updatePassword]
    );

    return (
        <Form error={error} onSubmit={handleSubmit}>
            <AccountPanel loading={loading} actionTitle='Update Password' />
            <h1 className={styles.changePassword}>Change Password?</h1>
            <InputField
                name='oldPassword'
                required
                component={SecureTextInput}
                className={styles.input}
                label='Current Password'
                labelClassName={styles.inputLabel}
                containerClassName={styles.inputGroup}
            />
            <Link to='#' className={styles.forgotPasswordLink}>
                Forgot Password?
            </Link>
            <InputField
                name='newPassword'
                required
                component={SecureTextInput}
                className={styles.input}
                label='New Password'
                labelClassName={styles.inputLabel}
                containerClassName={styles.inputGroup}
            />
            <InputField
                name='reNewPassword'
                required
                component={SecureTextInput}
                className={styles.input}
                label='Verify New Password'
                labelClassName={styles.inputLabel}
                containerClassName={styles.inputGroup}
            />
        </Form>
    );
};

export default UpdatePassword;

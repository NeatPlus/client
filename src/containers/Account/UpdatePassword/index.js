import {useCallback, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import Label from '@ra/components/Form/Label';
import Form from '@ra/components/Form';
import TextInput from '@ra/components/Form/TextInput';

import Toast from 'services/toast';
import useRequest from 'hooks/useRequest';
import {logout} from 'store/actions/auth';

import AccountPanel from '../AccountInfo';
import styles from './styles.scss';

const UpdatePassword = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [password, setPassword] = useState({
        first: '',
        confirm: '',
        error: '',
    });
    const [oldPassword, setOldPassword] = useState('');

    const handlePasswordChange = useCallback((target) => {
        const { name, value } = target;
        setPassword((prevState) => ({...prevState, [name]: value}));
        if (name === 'confirm') {
            if (value === password.first) {
                setPassword((prevState) => ({ ...prevState, [name]: value, error: '' })); 
            } else { 
                setPassword((prevState) => ({ ...prevState, [name]: value, error: 'Password did not match' }));
            }
        }
    }, [password.first]);
    
    const [updateState, updatePassword]= useRequest('/user/me/change_password/', {method: 'POST'});
    
    const handleSubmit = useCallback(async () => {
        if (oldPassword.length > 0 && password.first.length > 0 && password.confirm.length > 0) {
            if (password.first === password.confirm) {
                try {
                    const response = await updatePassword({ oldPassword: oldPassword, newPassword: password.first, reNewPassword: password.confirm });
                    if (response) {
                        Toast.show(response.detail, Toast.SUCCESS);
                        dispatch(logout());
                        history.push('/login');
                    }
                } catch (err) {
                    Toast.show('Incorrect old password !!', Toast.DANGER);
                }
            } else {
                setPassword({ ...password, error: 'Password did not match' });
            }
        } else {
            setPassword({...password, error: 'Invalid input !!'});
        }
    }, [dispatch, history, oldPassword, password, updatePassword]);

    const onOldPasswordChange = useCallback((e) => {
        setOldPassword(e.value);
    }, []);
       
    return (
        <Form onSubmit={handleSubmit}>
            <AccountPanel loading={updateState.loading} actionTitle="Update Password" action={handleSubmit} />
            <div className={styles.editForm}>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Current Password</Label>
                    <TextInput value={oldPassword.first} className={styles.input} onChange={(e) => onOldPasswordChange(e)} type="password" required name="currentPassword" />
                    <Link to="#" className={styles.forgotPasswordLink} >Forgot Password?</Link>
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>New Password</Label>
                    <TextInput name="first" value={password.first} onChange={handlePasswordChange} className={styles.input} type="password" required />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Verify New Password</Label>
                    <TextInput name="confirm" value={password.confirm} onChange={handlePasswordChange} className={styles.input} type="password" required />
                    <center className={styles.errorLabel}>{password.error}</center>
                </div>
            </div>
        </Form>
    );
};

export default UpdatePassword;

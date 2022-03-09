import {useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import AuthModals from 'components/AuthModals';
import Form, {InputField} from '@ra/components/Form';
import Input from '@ra/components/Form/Input';
import TextInput from '@ra/components/Form/TextInput';
import {_} from 'services/i18n';

import Api from 'services/api';
import Toast from 'services/toast';
import useAuthModals from 'hooks/useAuthModals';
import usePromise from '@ra/hooks/usePromise';
import {setUser} from 'store/actions/auth';

import AccountPanel from '../AccountInfo';
import styles from './styles.scss';

const UpdateInfo = () => {
    const {user} = useSelector((state) => state.auth);
    const authModalsConfig = useAuthModals();

    const dispatch = useDispatch();

    const [{loading}, changeProfile] = usePromise(Api.patchUser);
    const [{loading: emailLoading}, requestEmailChange] = usePromise(Api.requestEmailChange);

    const [formData, setFormData] = useState({});
    const [password, setPassword] = useState(null);

    const handleUpdateComplete = useCallback(async () => {
        Toast.show(_('Profile has been successfully updated!'), Toast.SUCCESS);
        try {
            const res = await Api.getUser();
            dispatch(setUser(res));
        } catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    const handleSubmitData = useCallback(async pass => {
        if(formData.email !== user.email) {
            setPassword(pass);
            await requestEmailChange({newEmail: formData.email, password: pass});
            Toast.show(_('An email has been sent to the new address'), Toast.SUCCESS);
            return authModalsConfig.handleShowVerifyEmail();
        }
        const submitParams = {...formData, password: pass};
        await changeProfile(submitParams);
        handleUpdateComplete();
        authModalsConfig.hideModals();
    }, [
        formData, 
        user, 
        changeProfile, 
        handleUpdateComplete, 
        requestEmailChange,
        authModalsConfig,
    ]);

    const handleChangeProfile = useCallback(formData => {
        const {fullName, organization, role, email} = formData;

        const name = fullName.split(' ');
        const firstName = name[0];
        const lastName = fullName.substring(name[0].length).trim();

        setFormData({
            firstName,
            lastName,
            organization,
            email,
            role,
        });
        authModalsConfig.handleShowConfirmPassword();
    }, [authModalsConfig]);

    return (
        <>
            <Form onSubmit={handleChangeProfile}>
                <AccountPanel actionTitle={_('Save Changes')} />
                <InputField
                    name='fullName'
                    required
                    component={TextInput}
                    className={styles.input}
                    label={_('Full Name')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={`${user.firstName} ${user.lastName}`}
                />
                <InputField
                    name='email'
                    info={_('If you change this, we will send you an email at your new address to confirm it. The new address will not become active until confirmed.')}
                    required
                    type='email'
                    component={Input}
                    className={styles.input}
                    label={_('Email')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={user.email}
                />
                <InputField
                    name='organization'
                    required
                    component={TextInput}
                    className={styles.input}
                    label={_('Organization')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={user.organization}
                />
                <InputField
                    name='role'
                    required
                    component={TextInput}
                    className={styles.input}
                    label={_('Role in Organization')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={user.role}
                />
            </Form>
            <AuthModals 
                {...authModalsConfig} 
                verifyMode="change"
                password={password}
                email={formData.email}
                onSubmit={handleSubmitData}
                loading={loading || emailLoading}
                onRegisterComplete={handleUpdateComplete}
            />
        </>
    );
};

export default UpdateInfo;

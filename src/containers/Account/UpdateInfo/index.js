import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';

import Form from '@ra/components/Form';
import Input from '@ra/components/Form/Input';
import {TextInput} from '@ra/components/Form/inputs';
import {InputField} from '@ra/components/Form';
import AccountPanel from '../AccountInfo';

import store from 'store';
import * as authActions from 'store/actions/auth';
import Api from 'services/api';
import Toast from 'services/toast';
import useRequest from 'hooks/useRequest';

import styles from './styles.scss';

const UpdateInfo = () => {
    const {user} = useSelector((state) => state.auth);
    const {dispatch} = store;

    const [error, setError] = useState(null);
    const [{loading}, updateInfo] = useRequest('/user/me/', {method: 'PATCH'});

    const handleSubmit = useCallback(
        async (formData) => {
            setError(null);
            const {fullName, email, organization, role} = formData;

            const name = fullName.split(' ');
            const firstName = name[0];
            const lastName = fullName.substring(name[0].length).trim();

            try {
                const result = await updateInfo({
                    firstName,
                    lastName,
                    email,
                    organization,
                    role,
                });
                if (result) {
                    const updatedUser = await Api.getUser();
                    dispatch(authActions.setUser(updatedUser));
                    Toast.show(
                        'Profile has been successfully updated !!',
                        Toast.SUCCESS
                    );
                }
            } catch (err) {
                setError(err);
                console.log(err);
            }
        },
        [dispatch, updateInfo]
    );

    return (
        <Form error={error} onSubmit={handleSubmit}>
            <AccountPanel loading={loading} actionTitle='Save Changes' />
            <InputField
                name='fullName'
                required
                component={TextInput}
                className={styles.input}
                label='Full Name'
                labelClassName={styles.inputLabel}
                containerClassName={styles.inputGroup}
                defaultValue={`${user.firstName} ${user.lastName}`}
            />
            <InputField
                name='email'
                required
                type='email'
                component={Input}
                className={styles.input}
                label='Email'
                labelClassName={styles.inputLabel}
                containerClassName={styles.inputGroup}
                defaultValue={user.email}
            />
            <InputField
                name='organization'
                required
                component={TextInput}
                className={styles.input}
                label='Organization'
                labelClassName={styles.inputLabel}
                containerClassName={styles.inputGroup}
                defaultValue={user.organization}
            />
            <InputField
                name='role'
                required
                component={TextInput}
                className={styles.input}
                label='Role in Organization'
                labelClassName={styles.inputLabel}
                containerClassName={styles.inputGroup}
                defaultValue={user.role}
            />
        </Form>
    );
};

export default UpdateInfo;

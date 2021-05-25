import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';

import Form from '@ra/components/Form';
import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import {TextInput} from '@ra/components/Form/inputs';

import store from 'store';
import * as authActions from 'store/actions/auth';
import Api from 'services/api';
import Toast from 'services/toast';
import useRequest from 'hooks/useRequest';

import AccountPanel from '../AccountInfo';
import styles from './styles.scss';

const UpdateInfo = () => {
    const {user} = useSelector(state => state.auth);
    const {dispatch} = store;
    const [userData, setUserData] = useState({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        org: user.organization,
        role: user.role,
        success: true
    });

    const [error, setError] = useState(false);
    const [infoState, updateInfo] = useRequest('/user/me/', {method: 'PATCH'});
    
    const handleSubmit = useCallback(async () => {
        setError(null);
        let firstName = '';
        let lastName = '';
        
        if (userData.fullName.length >0 && userData.email.length>0 && userData.org.length>0 && userData.role.length>0) {
            try {
                const name = userData.fullName.split(' ');
                firstName = name[0];
                lastName = name[1];
                
                const response = await updateInfo({ username: user.username, firstName, lastName, email: userData.email, organization: userData.org, role: userData.role });
                if (response) {
                    const updatedUser = await Api.getUser();
                    dispatch(authActions.setUser(updatedUser));
                    setUserData({ ...userData, success: true });
                    Toast.show('Profile has been successfully updated !!', Toast.SUCCESS);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            setError('Invalid input !!');
        }
     
    }, [dispatch, updateInfo, user.username, userData]);
    
    const onFullNameChange = useCallback((e) => {
        setUserData({ ...userData, fullName: e.value });
    }, [userData]);

    const onEmailChange = useCallback((e) => {
        setUserData({ ...userData, email: e.value });
    }, [userData]);
    
    const onOrgChange = useCallback((e) => {
        setUserData({ ...userData, org: e.value });
    }, [userData]);

    const onRoleChange = useCallback((e) => {
        setUserData({ ...userData, role: e.value });
    }, [userData]);
    
    return (
        <Form onSubmit={handleSubmit}>
            <AccountPanel loading={infoState.loading} actionTitle="Save Changes"/>
            <div className={styles.editForm}>    
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Full Name</Label>
                    <TextInput onChange={(e)=> onFullNameChange(e)} value={userData.fullName} className={styles.input} name="fullName" required />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Email</Label>
                    <Input onChange={(e) => onEmailChange(e)} value={userData.email} className={styles.input} name="email" type="email"  required />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Organization</Label>
                    <TextInput onChange={(e) => onOrgChange(e)} value={userData.org} className={styles.input} name="org" required />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Role in Organization</Label>
                    <TextInput onChange={(e) => onRoleChange(e)} value={userData.role} className={styles.input} controlClassName={styles.selectControl}
                        name="role" required />
                </div>
            </div>
            <center className={styles.errorMessage}>{error}</center>
        </Form>
    );
};

export default UpdateInfo;

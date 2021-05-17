import { Link } from 'react-router-dom';

import Form from '@ra/components/Form';
import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import { TextInput } from '@ra/components/Form/inputs';



import styles from './styles.scss';

const ChangePassword = () => {
    return (
        <div className={styles.details}>
            <div className={styles.accountInfo}>

                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        TS
                    </div>
                    <span className={styles.userName}> Tommy Shelby</span>
                </div>


                <button className={styles.saveBtn}>
                    Update Password
                </button>

            </div>
            <div className={styles.editForm}>
                <Form>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Current Password</Label>
                        <TextInput className={styles.input} type="password" name="currentPassword" />
                        <Link to="#" className={styles.forgotPasswordLink} >Forgot Password?</Link>
                    </div>

                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>New Password</Label>
                        <Input className={styles.input} name="password" type="password" />
                    </div>

                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Verify New Password</Label>
                        <TextInput className={styles.input} name="password" type="password" />
                    </div>


                </Form>


            </div>
        </div>
    );
};

export default ChangePassword;

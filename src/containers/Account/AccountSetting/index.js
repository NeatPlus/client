import styles from './styles.scss';
import Form from '@ra/components/Form';
import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import { TextInput, SelectInput } from '@ra/components/Form/inputs';


const AccountSetting = () => {
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
                    Save Changes
                </button>

            </div>

            <div className={styles.editForm}>
                <Form>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Full Name</Label>
                        <TextInput className={styles.input} name="fullName" placeholder="Tommy Shelby" />
                    </div>

                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Email</Label>
                        <Input className={styles.input} name="email" type="email" placeholder="tommy@shelbyltd.co" />
                    </div>

                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Organization</Label>
                        <TextInput className={styles.input} name="fullName" placeholder="Tommy Shelby" />
                    </div>

                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Role in Organization</Label>
                        <SelectInput className={styles.input} controlClassName={styles.selectControl}
                            name="organization" placeholder="Shelby Companies Ltd." />
                    </div>
                </Form>


            </div>
        </div>




    );

};

export default AccountSetting;

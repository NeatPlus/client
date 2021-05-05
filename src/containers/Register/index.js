import {Link} from 'react-router-dom';

import Form from 'components/Form';
import Button from 'components/Button';

import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import {TextInput, SecureTextInput, SelectInput, CheckboxInput} from '@ra/components/Form/inputs';

import cs from '@ra/cs';

import styles from './styles.scss';

const Register = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/" className={styles.headerLink}>NEAT+</Link>
            </div>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h1 className={styles.infoTitle}>Get Started with Neat+</h1>
                    <p className={styles.infoText}>
                        NEAT+ is conducted on the KoBo Toolbox data collection platform – an open source data collection tool – (on phone, tablet or computer) and produces an automatically generated report in Microsoft Excel, categorizing areas of risk into low, medium and high level of concern. The tool assesses the current sensitivity of the crisis-affected environment, highlighting any underlying risks and vulnerabilities to the environment and affected communities.
                    </p>
                    <div className={styles.infoLinks}>
                        <Link to="#" className={styles.link}>Privacy Policy</Link>
                        <Link to="#" className={styles.link}>Terms of Use</Link>
                    </div>
                </div>
                <Form className={styles.form}>
                    <h2 className={styles.formHeader}>Create your account</h2>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Full Name</Label>
                        <TextInput className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Email</Label>
                        <Input type="email" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Enter Password</Label>
                        <SecureTextInput className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Organization</Label>
                        <TextInput className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>What is your role?</Label>
                        <SelectInput 
                            searchable={false}
                            placeholder="Select your role in the company" 
                            className={cs(styles.input, styles.inputSelect)} 
                        />
                    </div>
                    <div className={styles.termsInput}>
                        <CheckboxInput className={styles.checkbox} />
                        <Label className={styles.termsInputLabel}>
                            I accept Neat+ <Link to="#" className={styles.termsInputLabelLink}>Terms of Use</Link> and  <Link to="#" className={styles.termsInputLabelLink}>Privacy Policy</Link>
                        </Label>
                    </div>
                    <Button>Create Account</Button>
                </Form>
            </div>
            <p className={styles.loginText}>
                Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
            </p>
        </div>
    );
};

export default Register;

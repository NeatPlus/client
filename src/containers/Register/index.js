import {useState, useCallback} from 'react';
import {Link} from 'react-router-dom';

import Form from 'components/Form';
import Button from 'components/Button';

import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import {TextInput, SecureTextInput, CheckboxInput} from '@ra/components/Form/inputs';
import logo from 'assets/images/logo-dark.svg';

import styles from './styles.scss';

const Register = () => {
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [inputData, setInputData] = useState({
        fullName: '',
        email: '',
        password: '',
        organization: '',
        role: '',
    });

    const handleChange = useCallback(({name, value}) => setInputData({
        ...inputData,
        [name]: value
    }), [inputData]);

    const handleCheck = useCallback(({checked}) => setAcceptTerms(checked), []);
    
    const handleRegister = useCallback(() => {
        // TODO: Register -> username same as email
        console.log(inputData);
    }, [inputData]);

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <Link to="/" className={styles.navLink}>
                    <img className={styles.logo} src={logo} alt="Neat+ Logo" />
                </Link>
            </div>
            <div className={styles.contentContainer}>
                <main className={styles.content}>
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
                    <Form onSubmit={handleRegister} className={styles.form}>
                        <h2 className={styles.formHeader}>Create your account</h2>
                        <div className={styles.inputGroup}>
                            <Label className={styles.inputLabel}>Full Name</Label>
                            <TextInput
                                name="fullName"
                                onChange={handleChange}
                                className={styles.input} 
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Label className={styles.inputLabel}>Email</Label>
                            <Input 
                                name="email"
                                type="email"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Label className={styles.inputLabel}>Enter Password</Label>
                            <SecureTextInput name="password" className={styles.input} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <Label className={styles.inputLabel}>Organization</Label>
                            <TextInput name="organization" onChange={handleChange} className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <Label className={styles.inputLabel}>What is your role?</Label>
                            <TextInput name="role" onChange={handleChange} className={styles.input} />
                        </div>
                        <div className={styles.termsInput}>
                            <CheckboxInput id="termsCheckbox" onChange={handleCheck} defaultChecked={acceptTerms} className={styles.checkbox} />
                            <label htmlFor="termsCheckbox" className={styles.termsInputLabel}>
                            I accept Neat+ <Link to="#" className={styles.termsInputLabelLink}>Terms of Use</Link> and  <Link to="#" className={styles.termsInputLabelLink}>Privacy Policy</Link>
                            </label>
                        </div>
                        <Button disabled={!acceptTerms}>Create Account</Button>
                    </Form>
                </main>
                <p className={styles.loginText}>
                    Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

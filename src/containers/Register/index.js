import {useState, useCallback} from 'react';
import {Link, useHistory} from 'react-router-dom';

import Container from 'components/Container';
import AuthModals from 'components/AuthModals';
import Button from 'components/Button';
import Form, {InputField} from '@ra/components/Form';
import Input from '@ra/components/Form/Input';
import {TextInput, SecureTextInput, CheckboxInput} from '@ra/components/Form/inputs';

import logo from 'assets/images/logo-dark.svg';
import useRequest from 'hooks/useRequest';
import useAuthModals from 'hooks/useAuthModals';
import {dispatchLogin} from 'utils/dispatch';

import styles from './styles.scss';

const Register = () => {
    const history = useHistory();
    const authModalsConfig = useAuthModals();
    
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState(null);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    
    const [{loading}, registerUser] = useRequest('/user/register/', {method: 'POST'});
    const [, loginUser] = useRequest('/jwt/create/', {method: 'POST'});

    const handleCheck = useCallback(({checked}) => setAcceptTerms(checked), []);
    
    const handleRegister = useCallback(async (formData) => {
        setError(null);

        const {
            fullName, 
            username, 
            email, 
            password, 
            organization, 
            role
        } = formData;

        setLoginData({username, password});

        const name = fullName.split(' ');
        const firstName = name[0];
        const lastName = fullName.substring(name[0].length).trim();

        if(!lastName) {
            setError({fullName: 'Lastname cannot be empty'});
            return;
        }

        try {
            const result = await registerUser({
                firstName,
                lastName,
                username,
                email,
                password,
                rePassword: password,
                organization,
                role,
            });
            if(result) {
                authModalsConfig.handleShowVerifyEmail();
            }
        } catch(err) {
            setError(err);
            console.log(err);
        }
    }, [registerUser, authModalsConfig]);

    const handleRegisterComplete = useCallback(async () => {
        const {username, password} = loginData;
        try {
            const result = await loginUser({username, password});
            if (result) {
                const {access, refresh} = result;
                await dispatchLogin(access, refresh);
                history.push('/projects/');
            }
        } catch (err) {
            setError(err);
            console.log(err);
        }
    }, [history, loginData, loginUser]);

    return (
        <div className={styles.registerContainer}>
            <Container>
                <div className={styles.registerContent}>
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
                                    <Link
                                        className={styles.link}
                                        to={{
                                            pathname: '/legal-document', 
                                            title: 'privacy-policy'
                                        }}
                                    >Privacy Policy</Link>
                                    <Link
                                        className={styles.link}
                                        to={{
                                            pathname: '/legal-document', 
                                            title: 'terms-and-conditions'
                                        }}
                                    >
                                        Terms of Use
                                    </Link>
                                </div>
                            </div>
                            <Form 
                                error={error}
                                formErrorClassName={styles.error}
                                onSubmit={handleRegister} 
                                className={styles.form}
                            >
                                <h2 className={styles.formHeader}>Create your account</h2>
                                <InputField
                                    name="fullName"
                                    required
                                    component={TextInput}
                                    className={styles.input}
                                    label="Full Name"
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <InputField
                                    name="username"
                                    required
                                    info="Length can be between 5 to 20. Letters, digits and ./-/_ only."
                                    component={TextInput}
                                    className={styles.input}
                                    label="Pick a username"
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <InputField
                                    name="email"
                                    required
                                    type="email"
                                    component={Input}
                                    className={styles.input}
                                    label="Email"
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <InputField
                                    name="password"
                                    required
                                    component={SecureTextInput}
                                    className={styles.input}
                                    label="Enter Password"
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <InputField
                                    name="organization"
                                    required
                                    component={TextInput}
                                    className={styles.input}
                                    label="Organization"
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <InputField
                                    name="role"
                                    required
                                    component={TextInput}
                                    className={styles.input}
                                    label="What is your role?"
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <div className={styles.termsInput}>
                                    <CheckboxInput id="termsCheckbox" size={18} onChange={handleCheck} defaultChecked={acceptTerms} className={styles.checkbox} />
                                    <label htmlFor="termsCheckbox" className={styles.termsInputLabel}>
                                        I accept Neat+
                                        <Link
                                            className={styles.termsInputLabelLink}
                                            to={{
                                                pathname: '/legal-document', 
                                                title: 'terms-and-conditions'
                                            }}
                                        >
                                            Terms of Use
                                        </Link>
                                        and 
                                        <Link
                                            className={styles.termsInputLabelLink}
                                            to={{
                                                pathname: '/legal-document', 
                                                title: 'privacy-policy'
                                            }}
                                        >
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                                <Button loading={loading} disabled={!acceptTerms}>Create Account</Button>
                            </Form>
                        </main>
                        <p className={styles.loginText}>
                            Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
                        </p>
                    </div>
                    <AuthModals username={loginData.username} onRegisterComplete={handleRegisterComplete} {...authModalsConfig} />
                </div>
            </Container>
        </div>
    );
};

export default Register;

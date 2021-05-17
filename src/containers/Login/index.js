import { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Button from 'components/Button';
import Form, { InputField } from '@ra/components/Form';
import TextInput from '@ra/components/Form/TextInput';
import SecureTextInput from '@ra/components/Form/SecureTextInput';

import useRequest from 'hooks/useRequest';
import { dispatchLogin } from 'utils/dispatch';

import logo from 'assets/images/logo-dark.svg';

import styles from './styles.scss';

const Login = () => {
    const history = useHistory();

    const [error, setError] = useState(null);
    const [{ loading }, loginUser] = useRequest('/jwt/create/', { method: 'POST' });

    const handleLogin = useCallback(async formData => {
        const { username, password } = formData;
        try {
            const result = await loginUser({ username, password });
            if (result) {
                const { access, refresh } = result;
                await dispatchLogin(access, refresh);
                history.push('/projects/');
            }
        } catch (err) {
            setError(err);
            console.log(err);
        }
    }, [history, loginUser]);

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <Link to="/" className={styles.navLink}>
                    <img className={styles.logo} src={logo} alt="Neat+ Logo" />
                </Link>
            </div>
            <main className={styles.content}>
                <h2 className={styles.subTitle}>Welcome back!</h2>
                <h1 className={styles.title}>Log in to Neat+</h1>
                <div className={styles.loginContainer}>
                    <Form
                        error={error}
                        onSubmit={handleLogin}
                        className={styles.loginForm}
                    >
                        <InputField
                            label="Email or Username"
                            component={TextInput}
                            name="username"
                            className={styles.input}
                            labelClassName={styles.inputLabel}
                            containerClassName={styles.inputGroup}
                        />
                        <InputField
                            label="Password"
                            component={SecureTextInput}
                            name="password"
                            className={styles.input}
                            labelClassName={styles.inputLabel}
                            containerClassName={styles.inputGroup}
                        />
                        <Button loading={loading} className={styles.button}>
                            Log in
                        </Button>
                    </Form>
                    <Link className={styles.forgotLink} to="#">Forgot Password?</Link>
                    <p className={styles.text}>
                        Don't have an account? <Link className={styles.link} to="/register">Register Now</Link>
                    </p>
                </div>
                <div className={styles.bottomLinks}>
                    <Link to="#" className={styles.link}>Privacy Policy</Link>
                    <Link to="#" className={styles.link}>Terms of Use</Link>
                </div>
            </main>
        </div>
    );
};

export default Login;

import {useState, useCallback} from 'react';
import {Link} from 'react-router-dom';

import Form from 'components/Form';
import Button from 'components/Button';
import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import SecureTextInput from '@ra/components/Form/SecureTextInput';

import logo from 'assets/images/logo-dark.svg';

import styles from './styles.scss';

const Login = () => {
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
    });

    const handleChange = useCallback(({name, value}) => setInputData({
        ...inputData,
        [name]: value
    }), [inputData]);

    const handleLogin = useCallback(() => {
        // TODO: Login
        console.log(inputData);
    }, [inputData]);

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
                    <Form onSubmit={handleLogin} className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                            <Label className={styles.inputLabel}>Email or Username</Label>
                            <Input name="email" onChange={handleChange} type="email" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <Label className={styles.inputLabel}>Password</Label>
                            <SecureTextInput name="password" onChange={handleChange} className={styles.input} />
                        </div>
                        <Button className={styles.button}>Log in</Button>
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

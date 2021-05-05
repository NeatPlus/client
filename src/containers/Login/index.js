import {Link} from 'react-router-dom';

import Form from 'components/Form';
import Button from 'components/Button';

import Label from '@ra/components/Form/Label';
import Input from '@ra/components/Form/Input';
import SecureTextInput from '@ra/components/Form/SecureTextInput';

import styles from './styles.scss';

const Login = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/" className={styles.headerLink}>NEAT+</Link>
            </div>
            <h2 className={styles.subTitle}>Welcome back!</h2>
            <h1 className={styles.title}>Log in to Neat+</h1>
            <div className={styles.loginContainer}>
                <Form className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Email or Username</Label>
                        <Input type="email" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Password</Label>
                        <SecureTextInput className={styles.input} />
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
        </div>
    );
};

export default Login;

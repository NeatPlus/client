import {useCallback, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

import useRequest from 'hooks/useRequest';
import {dispatchLogin} from 'utils/dispatch';

import Container from 'components/Container';
import AuthModals from 'components/AuthModals';
import Button from 'components/Button';
import Form, {InputField} from '@ra/components/Form';
import TextInput from '@ra/components/Form/TextInput';
import SecureTextInput from '@ra/components/Form/SecureTextInput';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import initStore from 'services/initStore';
import useAuthModals from 'hooks/useAuthModals';

import logo from 'assets/images/logo-dark.svg';

import styles from './styles.scss';

const Login = () => {
    const authModalsConfig = useAuthModals();
    const history = useHistory();

    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');

    const [{loading}, loginUser] = useRequest('/jwt/create/', {
        method: 'POST',
    });

    const handleLogin = useCallback(
        async (formData) => {
            const {username, password} = formData;
            setEmail(username);
            setError(null);
            try {
                const result = await loginUser({username, password});
                if (result) {
                    const {access, refresh} = result;
                    await dispatchLogin(access, refresh);
                    history.push('/projects/');
                    initStore();
                }
            } catch (err) {
                setError(err);
                console.log(err);
            }
        },
        [history, loginUser]
    );

    return (
        <div className={styles.loginContainer}>
            <Container>
                <div className={styles.loginContent}>
                    <div className={styles.nav}>
                        <Link to='/' className={styles.navLink}>
                            <img
                                className={styles.logo}
                                src={logo}
                                alt={_('Neat+ Logo')}
                            />
                        </Link>
                    </div>
                    <main className={styles.content}>
                        <h2 className={styles.subTitle}><Localize>Welcome back!</Localize></h2>
                        <h1 className={styles.title}><Localize>Log in to NEAT+</Localize></h1>
                        <div className={styles.loginContainer}>
                            <Form
                                error={error}
                                formErrorClassName={styles.error}
                                onSubmit={handleLogin}
                                className={styles.loginForm}
                            >
                                <InputField
                                    label={_('Email or Username')}
                                    component={TextInput}
                                    name='username'
                                    required
                                    className={styles.input}
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <InputField
                                    label={_('Password')}
                                    component={SecureTextInput}
                                    name='password'
                                    required
                                    className={styles.input}
                                    labelClassName={styles.inputLabel}
                                    containerClassName={styles.inputGroup}
                                />
                                <Button loading={loading} className={styles.button}>
                                    <Localize>Log in</Localize>
                                </Button>
                            </Form>
                            <div className={styles.links}>
                                <Link
                                    className={styles.linkItem}
                                    to='#'
                                    onClick={authModalsConfig.handleShowForgotPassword}
                                >
                                    <Localize>Forgot Password?</Localize>
                                </Link>
                                {!!error && (
                                    <Link 
                                        className={styles.linkItem} 
                                        to="#" 
                                        onClick={authModalsConfig.handleShowVerifyEmail}
                                    >
                                        <Localize>Activate account?</Localize>
                                    </Link>
                                )}
                            </div>
                            <p className={styles.text}>
                                <Localize>Don't have an account?</Localize>{' '}
                                <Link className={styles.link} to='/register'>
                                    <Localize>Register Now</Localize>
                                </Link>
                            </p>
                        </div>
                        <div className={styles.bottomLinks}>
                            <Link
                                className={styles.link}
                                to={{
                                    pathname: '/legal-document', 
                                    title: 'privacy-policy'
                                }}
                            >
                                <Localize>Privacy Policy</Localize>
                            </Link>
                            <Link
                                className={styles.link}
                                to={{
                                    pathname: '/legal-document', 
                                    title: 'terms-and-conditions'
                                }}
                            >
                                <Localize>Terms of Use</Localize>
                            </Link>
                        </div>
                    </main>
                </div>
                <AuthModals 
                    username={email} 
                    onRegisterComplete={authModalsConfig.hideModals} 
                    {...authModalsConfig} 
                />
            </Container>
        </div>
    );
};

export default Login;

import {NavLink, Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

import Container from 'components/Container';
import Input from '@ra/components/Form/Input';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import cs from '@ra/cs';

import lightLogo from 'assets/images/logo-light.svg';
import darkLogo from 'assets/images/logo-dark.svg';

import styles from './styles.scss';

const LinkItem = ({to, title, isDark}) => {
    return (
        <NavLink
            to={to}
            activeClassName={styles.navLinkActive}
            className={cs(styles.navLink, {
                [styles.navLinkDark]: isDark
            })}
        >
            <li className={styles.navItem}>{title}</li>
        </NavLink>
    );
};

export const NavBar = ({dark}) => {
    const {isAuthenticated} = useSelector((state) => state.auth);

    return (
        <Container>
            <nav className={styles.navbar}>
                <div className={styles.navBrand}>
                    <Link to='/'>
                        <img className={styles.logo} src={dark ? darkLogo : lightLogo} alt='logo' />
                    </Link>
                </div>
                <Input
                    className={styles.navToggleCheckbox}
                    id='nav-menu-toggle'
                    type='checkbox'
                />
                <label htmlFor='nav-menu-toggle' className={styles.menuToggle}>
                    <span className={styles.menuToggleIcon}></span>
                </label>
                <div className={cs(styles.navMenu, {
                    [styles.navMenuDark]: dark
                })}>
                    <ul className={styles.navItems}>
                        <LinkItem isDark={dark} to='/about' title={_('About')} />
                        <LinkItem isDark={dark} to='/action' title={_('NEAT+ in Action')} />
                        <LinkItem isDark={dark} to='/resource' title={_('Resources and Support')} />
                        <LinkItem isDark={dark} to='/contact' title={_('Contact')} />
                    </ul>
                    <ul className={styles.navItems}>
                        {!isAuthenticated && (
                            <LinkItem isDark={dark} to='/login' title={_('Login')} />
                        )}
                        <NavLink
                            to='/access'
                            activeClassName={styles.accessButtonActive}
                            className={cs(styles.accessButton,
                                {[styles.accessButtonDark]: dark}
                            )}
                        >
                            <li className={styles.accessItem}><Localize>Access the NEAT+</Localize></li>
                        </NavLink>
                    </ul>
                </div>
            </nav>
        </Container>
    );
};

export default NavBar;

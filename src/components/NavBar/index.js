import {NavLink, Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

import Input from '@ra/components/Form/Input';
import logo from 'assets/images/logo-light.svg';

import styles from './styles.scss';

export const NavBar = (props) => {
    const {isAuthenticated} = useSelector(state => state.auth);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navBrand}>
                <Link to="/">
                    <img className={styles.logo} src={logo} alt="logo" />
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
            <div className={styles.navMenu}>
                <ul className={styles.navItems}>
                    <NavLink
                        to='/about'
                        activeClassName={styles.navLinkActive}
                        className={styles.navLink}
                    >
                        <li className={styles.navItem}>About</li>
                    </NavLink>
                    <NavLink
                        to='/action'
                        activeClassName={styles.navLinkActive}
                        className={styles.navLink}
                    >
                        <li className={styles.navItem}>NEAT+ in Action</li>
                    </NavLink>
                    <NavLink
                        to='/contact'
                        activeClassName={styles.navLinkActive}
                        className={styles.navLink}
                    >
                        <li className={styles.navItem}>Contact</li>
                    </NavLink>
                </ul>
                <ul className={styles.navItems}>
                    {!isAuthenticated && (
                        <NavLink
                            to='/login'
                            activeClassName={styles.navLinkActive}
                            className={styles.navLink}
                        >
                            <li className={styles.navItem}>Login</li>
                        </NavLink>
                    )}
                    <NavLink
                        to='/access'
                        activeClassName={styles.accessButtonActive}
                        className={styles.accessButton}
                    >
                        <li className={styles.accessItem}>Access the NEAT+</li>
                    </NavLink>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;

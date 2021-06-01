import {Link} from 'react-router-dom';
import {FaFacebook, FaTwitter, FaYoutube} from 'react-icons/fa';

import logo from 'assets/images/logo-light.svg';

import styles from './styles.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerHead}>
                <img className={styles.footerLogo} src={logo} alt="neat-logo" />
                <div className={styles.socialIconWrapper}>
                    <a href="#" target="_blank"> <FaFacebook className={styles.socialIcon} /></a>
                    <a href="#" target="_blank"> <FaTwitter className={styles.socialIcon} /></a>
                    <a href="#" target="_blank"> <FaYoutube className={styles.socialIcon} /></a>
                </div>
            </div>
            <hr className={styles.seperator} />
            <div className={styles.footerNav}>
                <div className={styles.footerNavList}>
                    <h4 className={styles.footerNavTitle}>ABOUT</h4>
                    <div className={styles.footerNavItem}>
                        <Link className={styles.footerNavLink} to="#">
                            Why Environmental Assessments
                            in Humanitarian Operations?
                        </Link>
                    </div>
                    <div className={styles.footerNavItem}>
                        <Link className={styles.footerNavLink} to="#">
                            About NEAT+
                        </Link>
                    </div>
                    <div className={styles.footerNavItem}>
                        <Link className={styles.footerNavLink} to="#">
                            Rural and Urban NEAT+
                        </Link>
                    </div>
                    <div className={styles.footerNavItem}>
                        <Link className={styles.footerNavLink} to="#">
                            History of the NEAT+
                        </Link>
                    </div>
                </div>
                <div className={styles.footerNavList}>
                    <h4 className={styles.footerNavTitle}>ACCESS THE NEAT+</h4>
                    <div className={styles.footerNavItem}>
                        <Link className={styles.footerNavLink} to="#">
                            Urban NEAT+
                        </Link>
                    </div>
                    <div className={styles.footerNavItem}>
                        <Link className={styles.footerNavLink} to="#">
                            Rural NEAT+
                        </Link>
                    </div>
                </div>
                <div className={styles.footerNavList}>
                    <h4 className={styles.footerNavTitle}>NEAT+ IN ACTION</h4>
                    <div className={styles.footerNavItem}>
                        <a className={styles.footerNavLink} href="#">
                            Scoping Videos and Reports
                        </a>
                    </div>
                </div>
                <div className={styles.footerNavList}>
                    <h4 className={styles.footerNavTitle}>RESOURCE AND SUPPORT</h4>
                    <div className={styles.footerNavItem}>
                        <a className={styles.footerNavLink} href="#">
                            Videos and Guidance
                        </a>
                    </div>
                </div>
            </div>
            <hr className={styles.seperator} />
            <div className={styles.footerCred}>
                <div className={styles.rightInfo}>
                    &copy; NEAT+,2021
                </div>
                <div className={styles.rightContent}>
                    <Link className={styles.policyLink} to="#">Privacy Policy</Link>
                    <Link className={styles.policyLink} to="#">Terms of use</Link>
                    <Link className={styles.policyLink} to="#">Cookie Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
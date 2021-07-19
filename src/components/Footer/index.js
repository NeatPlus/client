import {Link} from 'react-router-dom';
import {FaFacebook, FaTwitter, FaYoutube} from 'react-icons/fa';

import Container from 'components/Container';

import logo from 'assets/images/logo-light.svg';

import styles from './styles.scss';

const Footer = () => {
    return (
        <section className={styles.footerContainer}>
            <Container>
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
                                <Link className={styles.footerNavLink} to="/about">
                            Why Environmental Assessments
                            in Humanitarian Operations?
                                </Link>
                            </div>
                            <div className={styles.footerNavItem}>
                                <Link className={styles.footerNavLink} to="/about">
                            About NEAT+
                                </Link>
                            </div>
                            <div className={styles.footerNavItem}>
                                <Link className={styles.footerNavLink} to="/access">
                            Rural and Urban NEAT+
                                </Link>
                            </div>
                            <div className={styles.footerNavItem}>
                                <Link className={styles.footerNavLink} to="/about">
                            History of the NEAT+
                                </Link>
                            </div>
                        </div>
                        <div className={styles.footerNavList}>
                            <h4 className={styles.footerNavTitle}>ACCESS THE NEAT+</h4>
                            <div className={styles.footerNavItem}>
                                <Link className={styles.footerNavLink} to="/access">
                            Urban NEAT+
                                </Link>
                            </div>
                            <div className={styles.footerNavItem}>
                                <Link className={styles.footerNavLink} to="/access">
                            Rural NEAT+
                                </Link>
                            </div>
                        </div>
                        <div className={styles.footerNavList}>
                            <h4 className={styles.footerNavTitle}>NEAT+ IN ACTION</h4>
                            <div className={styles.footerNavItem}>
                                <Link className={styles.footerNavLink} to="/action">
                            Scoping Videos and Reports
                                </Link>
                            </div>
                        </div>
                        <div className={styles.footerNavList}>
                            <h4 className={styles.footerNavTitle}>RESOURCE AND SUPPORT</h4>
                            <div className={styles.footerNavItem}>
                                <Link className={styles.footerNavLink} to="/resource">
                            Videos and Guidance
                                </Link>
                            </div>
                        </div>
                    </div>
                    <hr className={styles.seperator} />
                    <div className={styles.footerCred}>
                        <div className={styles.rightInfo}>
                    &copy; NEAT+,{new Date().getFullYear()}
                        </div>
                        <div className={styles.rightContent}>
                            <Link className={styles.policyLink} to="#">Privacy Policy</Link>
                            <Link className={styles.policyLink} to="#">Terms of use</Link>
                            <Link className={styles.policyLink} to="#">Cookie Policy</Link>
                        </div>
                    </div>
                </footer>
            </Container>
        </section>
    );
};

export default Footer;

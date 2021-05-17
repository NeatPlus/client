import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import styles from './styles.scss';
import logo from 'assets/images/logo-light.svg';


const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerHead}>
                <img className={styles.footerLogo} src={logo} alt="logo" />
                <div className={styles.social}>
                    <a href="#" target="_blank"> <FaFacebook size="30px" className={styles.socialIcons} /></a>
                    <a href="#" target="_blank"> <FaTwitter size="30px" className={styles.socialIcons} /></a>
                    <a href="#" target="_blank"> <FaYoutube size="30px" className={styles.socialIcons} /></a>
                </div>
            </div>
            <hr className={styles.seperator} />

            <div className={styles.footerNav}>

                <div className={styles.footerNavList}>
                    <h4 className={styles.footerNavTitle}>ABOUT</h4>

                    <div className={styles.footerNavItem}>

                        <a className={styles.footerNavLink} href="#">
                            Why Environmental Assessments
                            in Humanitarian Operations?
                        </a>
                    </div>

                    <div className={styles.footerNavItem}>

                        <a className={styles.footerNavLink} href="#">
                            About NEAT+
                        </a>
                    </div>

                    <div className={styles.footerNavItem}>

                        <a className={styles.footerNavLink} href="#">
                            Rural and Urban NEAT+
                        </a>
                    </div>

                    <div className={styles.footerNavItem}>

                        <a className={styles.footerNavLink} href="#">
                            History of the NEAT+
                        </a>
                    </div>

                </div>

                <div className={styles.footerNavList}>

                    <h4 className={styles.footerNavTitle}>ACCESS THE NEAT+</h4>
                    <div className={styles.footerNavItem}>

                        <a className={styles.footerNavLink} href="#">
                            Urban NEAT+
                        </a>
                    </div>
                    <div className={styles.footerNavItem}>

                        <a className={styles.footerNavLink} href="#">
                            Rural NEAT+
                        </a>
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
                <div>
                    <p>
                        &copy; NEAT+,2021
                    </p>
                </div>
                <div>
                    <a className={styles.policyLink} hreg="#">Privacy Policy</a>
                    <a className={styles.policyLink} hreg="#">Terms of use</a>
                    <a className={styles.policyLink} hreg="#">Cookie Policy</a>
                </div>

            </div>
        </footer>

    );

};

export default Footer;

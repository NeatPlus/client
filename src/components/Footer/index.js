import {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {FaFacebook, FaTwitter, FaYoutube} from 'react-icons/fa';

import Container from 'components/Container';

import List from '@ra/components/List';

import logo from 'assets/images/logo-light.svg';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const Footer = () => {
    const {legislations} = useSelector((state) => state.legislation);
    const renderLink = useCallback(({item}) => {
        return (
            <Link
                className={styles.policyLink}
                to={{
                    pathname: '/legal-document', 
                    title: item?.documentType
                }}
            >
                {item?.documentType.split('-').join(' ')}
            </Link>
        );
    }, []);
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
                        {legislations.length > 0 && (
                            <List
                                className={styles.rightContent}
                                data={legislations}
                                renderItem={renderLink}
                                keyExtractor={keyExtractor}
                            />
                        )}
                    </div>
                </footer>
            </Container>
        </section>
    );
};

export default Footer;

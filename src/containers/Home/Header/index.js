import { Link } from 'react-router-dom';
import styles from './styles.scss';
import logo from 'assets/images/logo-light.svg';
import heroImage from 'assets/images/hero.webp';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.navigationBar}>
                <img className={styles.logo} src={logo} alt="neat+ logo" />
                <nav>
                    <ul className={styles.navItems}>

                        <li className={styles.navItem}>
                            <a className={styles.navLink} href="#">About</a>
                        </li>
                        <li className={styles.navItem}>
                            <a className={styles.navLink} href="#">NEAT+ in Action</a>
                        </li>
                        <li className={styles.navItem}>
                            <a className={styles.navLink} href="#">Resources and Support</a>
                        </li>
                        <li className={styles.navItem}>
                            <a className={styles.navLink} href="#">Resources and Support</a>
                        </li>

                    </ul>

                </nav>
                <div className={styles.accessLinks}>
                    <Link className={styles.accessLink} to="/login">
                        Log in
                    </Link>
                    <Link to="/projects">
                        <button className={styles.lightButton}>Access the NEAT+</button>
                    </Link>

                </div>
            </div>

            <main className={styles.heroSection}>

                <div className={styles.hero}>

                    <h1 className={styles.headerTitle}>
                        Rapid and simple project-level environmental screening for humanitarian
                    </h1>

                    <p className={styles.heroText}>
                        Freely available, the Nexus Environmental Assessment Tool (NEAT+) has been specifically designed for
                        humanitarian actors
                        to quickly identify issues of environmental concern to make emergency and recovery interventions
                        more sustainable.
                    </p>

                    <div>
                        <button className={styles.darkButton}>Get Started</button>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <img className={styles.heroImage} src={heroImage} alt="App Visual" />
                </div>
            </main>
        </header>
    );
};

export default Header;

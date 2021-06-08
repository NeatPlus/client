import {Link} from 'react-router-dom';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import Button from 'components/Button';

import AboutSection from './AboutSection';
import AdaptedSection from './AdaptedSection';
import PartnerSection from './PartnerSection';
import FeedbackSection from './FeedbackSection';
import ExampleSection from './ExampleSection';

import header from 'assets/images/home-header.webp';

import styles from './styles.scss';

const Home = () => {
    return (
        <div className={styles.containerHome}>
            <header className={styles.header}>
                <NavBar />
                <div className={styles.hero}>
                    <div className={styles.heroInfo}>
                        <h1 className={styles.heroTitle}>Rapid and simple project-level environmental screening for humanitarian operations</h1>
                        <p className={styles.heroDesc}>
                            Free and open-source, the Nexus Environmental Assessment Tool (NEAT+) has been specifically designed for humanitarian actors to quickly identify issues of environmental concern to make emergency and recovery interventions more sustainable.
                        </p>
                        <Link to="/access">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                    <img className={styles.heroImage} src={header} alt="about-header" />
                </div>
            </header>
            <AboutSection />
            <AdaptedSection />
            <ExampleSection />
            <PartnerSection />
            <FeedbackSection />
            <Footer />
        </div>
    );
};

export default Home;

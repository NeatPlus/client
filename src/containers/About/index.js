import NavBar from 'components/NavBar';
import Footer from 'components/Footer';

import MeasureSection from './MeasureSection';
import ResultSection from './ResultSection';
import WorkSection from './WorkSection';

import header from 'assets/images/about-header.webp';

import styles from './styles.scss';

const About = () => {
    return (
        <div className={styles.containerAbout}>
            <header className={styles.header}>
                <NavBar />
                <div className={styles.hero}>
                    <div className={styles.heroInfo}>
                        <h1 className={styles.heroTitle}>About the NEAT+ </h1>
                        <p className={styles.heroDesc}>
                            The Nexus Environmental Assessment Tool (NEAT+) is a rapid and simple project-level environmental screening tool that allows humanitarian actors to quickly identify issues of environmental concern before designing longer-term emergency or recovery interventions. The NEAT+ was developed by the Coordination of Assessments for Environment in Humanitarian Action Joint Initiative; a multi-stakeholder project aiming to improve the coordination between environmental and humanitarian actors including organizations such as USAID, UNHCR, NRC, IUCN, WWF and other partners. It is currently maintained and developed with the UNEP/OCHA Joint Environment Unit as custodian. 
                            The NEAT+ was specifically designed to address the needs of humanitarian actors and to provide a creative and practical approach to integrating more sustainable environmental practices into humanitarian aid. The NEAT+ is a fully developed and proven tool, available in English, French, and Spanish. In 2021, an urban adaptation (U-NEAT+) is under development, with the sensitivities module available from this site from July 2021. There are plans to migrate the R-NEAT to this format at a later stage.
                        </p>
                    </div>
                    <img className={styles.heroImage} src={header} alt="about-header" />
                </div>
            </header>
            <MeasureSection />
            <WorkSection />
            <ResultSection />
            <Footer />
        </div>
    );
};

export default About;

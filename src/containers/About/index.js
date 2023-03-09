import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import {Localize} from '@ra/components/I18n';

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
                        <h1 className={styles.heroTitle}>
                            <Localize>About the NEAT+</Localize>
                        </h1>
                        <p className={styles.heroDesc}>
                            <Localize>
                                The Nexus Environmental Assessment Tool (NEAT+) is a rapid and simple project-level environmental screening tool that allows humanitarian actors to quickly identify issues of environmental concern before designing longer-term emergency or recovery interventions. The NEAT+ was developed by the Coordination of Assessments for Environment in Humanitarian Action Joint Initiative; a multi-stakeholder project aiming to improve the coordination between environmental and humanitarian actors including organizations such as USAID, UNHCR, NRC, IUCN, WWF and other partners. It is currently maintained and developed with the UNEP/OCHA Joint Environment Unit as custodian.
                            </Localize>
                        </p>
                        <p className={styles.heroDesc}>
                            <Localize>The NEAT+ was specifically designed to address the needs of humanitarian actors and to provide a creative and practical approach to integrating more sustainable environmental practices into humanitarian aid. The Rural NEAT+ is available for use in Excel and KoBo Toolbox, while the Urban NEAT+ is available for use in this web application. There are plans to merge Rural and Urban NEAT+ into one application that can be used online and offline.
                            </Localize>
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

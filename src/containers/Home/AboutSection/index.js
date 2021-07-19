import {Link} from 'react-router-dom';
import {BsArrowRight} from 'react-icons/bs';

import Container from 'components/Container';

import aboutImage from 'assets/images/home-about.webp';
import questionIcon from 'assets/images/why-neat.svg';
import calendarIcon from 'assets/images/when-neat.svg';
import userIcon from 'assets/images/about-who.svg';

import styles from './styles.scss';

const AboutSection = () => {
    return (
        <section className={styles.aboutContainer}>
            <Container jumbotron>
                <div className={styles.aboutSection}>
                    <div className={styles.aboutDetail}>
                        <h1 className={styles.aboutTitle} >About NEAT+</h1>
                        <p className={styles.aboutDesc}>
                    The NEAT+  is a project-level screening tool, specifically designed for situations of displacement, which combines environmental data with site-specific and activity-based questions to automatically analyze and flag priority environmental risks. This allows the users and organizations to understand environmental sensitivities, mitigate risks, and find opportunities to collaborate on greener humanitarian operations.
                        </p>
                        <div className={styles.infoList}>
                            <div className={styles.infoListItem}>
                                <div className={styles.imageWrapper}>
                                    <img src={questionIcon} alt="question icon" />
                                </div>
                                <div>
                                    <h3 className={styles.reasonTitle}>Why?</h3>
                                    <ul className={styles.reasonList}>
                                        <li className={styles.reasonDesc}>A simple, user-friendly way for non-environmentalists to identify environmental concerns</li>
                                        <li className={styles.reasonDesc}>Flags key issues for subsequent mitigation and advocacy</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.infoListItem}>
                                <div className={styles.imageWrapper}>
                                    <img src={userIcon} alt="users icon" />
                                </div>
                                <div>
                                    <h3 className={styles.reasonTitle}>Who?</h3>
                                    <p className={styles.reasonDesc}>
                                Humanitarian actors, e.g. field staff, community members and team leaders working in camp, peri-urban or rural noncamp or informal camp settings
                                    </p>
                                </div>
                            </div>
                            <div className={styles.infoListItem}>
                                <div className={styles.imageWrapper}>
                                    <img src={calendarIcon} alt="calendar icon" />
                                </div>
                                <div>
                                    <h3 className={styles.reasonTitle}>When?</h3>
                                    <p className={styles.reasonDesc}>
                                After life-saving needs have been met; immediately following
                                a crisis and prior to project design, or during a change in
                                humanitarian setting, such as an expansion of a camp or
                                development of new livelihood support programs
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.learnMore}>
                            <Link to="/about" className={styles.learnMoreLink}>
                        Learn More<BsArrowRight className={styles.learnMoreIcon} />
                            </Link>
                        </div>
                    </div>
                    <div className={styles.infoVisual}>
                        <img className={styles.infoImage} src={aboutImage} alt="App Usage" />
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default AboutSection;

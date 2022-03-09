import {Link} from 'react-router-dom';
import {BsArrowRight} from 'react-icons/bs';

import Container from 'components/Container';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

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
                        <h1 className={styles.aboutTitle}><Localize>About NEAT+</Localize></h1>
                        <p className={styles.aboutDesc}>
                            <Localize>
                                The NEAT+  is a project-level screening tool, specifically designed for situations of displacement, which combines environmental data with site-specific and activity-based questions to automatically analyze and flag priority environmental risks. This allows the users and organizations to understand environmental sensitivities, mitigate risks, and find opportunities to collaborate on greener humanitarian operations.
                            </Localize>
                        </p>
                        <div className={styles.infoList}>
                            <div className={styles.infoListItem}>
                                <div className={styles.imageWrapper}>
                                    <img src={questionIcon} alt="Question icon" />
                                </div>
                                <div>
                                    <h3 className={styles.reasonTitle}><Localize>Why?</Localize></h3>
                                    <ul className={styles.reasonList}>
                                        <li className={styles.reasonDesc}>
                                            <Localize>
                                                A simple, user-friendly way for non-environmentalists to identify environmental concerns
                                            </Localize>
                                        </li>
                                        <li className={styles.reasonDesc}>
                                            <Localize>
                                                Flags key issues for subsequent mitigation and advocacy
                                            </Localize>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.infoListItem}>
                                <div className={styles.imageWrapper}>
                                    <img src={userIcon} alt="Users icon" />
                                </div>
                                <div>
                                    <h3 className={styles.reasonTitle}><Localize>Who?</Localize></h3>
                                    <p className={styles.reasonDesc}>
                                        <Localize>
                                            Humanitarian actors, e.g. field staff, community members and team leaders working in camp, peri-urban or rural noncamp or informal camp settings
                                        </Localize>
                                    </p>
                                </div>
                            </div>
                            <div className={styles.infoListItem}>
                                <div className={styles.imageWrapper}>
                                    <img src={calendarIcon} alt="calendar icon" />
                                </div>
                                <div>
                                    <h3 className={styles.reasonTitle}><Localize>When?</Localize></h3>
                                    <p className={styles.reasonDesc}>
                                        <Localize>
                                            After life-saving needs have been met; immediately following a crisis and prior to project design, or during a change in humanitarian setting, such as an expansion of a camp or development of new livelihood support programs
                                        </Localize>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.learnMore}>
                            <Link to="/about" className={styles.learnMoreLink}>
                                <Localize>Learn More</Localize><BsArrowRight className={styles.learnMoreIcon} />
                            </Link>
                        </div>
                    </div>
                    <div className={styles.infoVisual}>
                        <img className={styles.infoImage} src={aboutImage} alt={_('App Usage')} />
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default AboutSection;

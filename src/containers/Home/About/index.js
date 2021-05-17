import { BsArrowRight } from 'react-icons/bs';
import styles from './styles.scss';
import aboutImage from 'assets/images/about.webp';
import questionIcon from 'assets/icons/question.svg';
import calendarIcon from 'assets/icons/calendar.svg';
import userIcon from 'assets/icons/users.svg';

const About = () => {

    return (
        <section className={styles.aboutSection}>
            <div>
                <div className={styles.aboutDetail}>
                    <h1 className={styles.title} >About NEAT+</h1>
                    <p className={styles.aboutPara}>
                        The NEAT+ is a project-level screening tool, specifically designed for situations of displacement,
                        which
                        combines
                        environmental data with site-specific and activity-based questions to automatically analyze and flag
                        priority
                        environmental risks. This allows the users and organizations to understand environmental
                        sensitivities,
                        mitigate risks,
                        and find opportunities to collaborate on greener humanitarian operations.
                    </p>
                </div>
                <div className={styles.infoList}>
                    <div className={styles.infoListItem}>
                        <img src={questionIcon} alt="question icon" />

                        <div>
                            <h3 className={styles.reasonTitle}>Why NEAT+?</h3>

                            <ul>
                                <li>
                                    A simple, user-friendly way for non-environmentalists to identify environmental concerns
                                </li>
                                <li>
                                    Flags key issues for subsequent mitigation and advocacy
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.infoListItem}>
                        <img src={userIcon} alt="users icon" />

                        <div>
                            <h3 className={styles.reasonTitle}>Who?</h3>
                            <p className={styles.aboutPara}>
                                Humanitarian actors, e.g. field staff, community members and team leaders working in camp,
                                peri-urban or rural noncamp
                                or informal camp settings
                            </p>
                        </div>
                    </div>
                    <div className={styles.infoListItem}>
                        <img src={calendarIcon} alt="calendar icon" />

                        <div>
                            <h3 className={styles.reasonTitle}>When?</h3>
                            <p className={styles.aboutPara}>
                                Humanitarian actors, e.g. field staff, community members and team leaders working in camp,
                                peri-urban or rural noncamp
                                or informal camp settings
                            </p>
                        </div>
                    </div>

                </div>
                <div className={styles.learnMore}>
                    <a className={styles.learnMoreLink}>
                        Learn More    <BsArrowRight className={styles.learnMoreIcon} size="25px" />
                    </a>
                </div>
            </div>

            <div className={styles.infoVisual}>
                <img className={styles.infoImage} src={aboutImage} alt="App Usage" ></img>

            </div>

        </section>

    );
};

export default About;

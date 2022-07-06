import Container from 'components/Container';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import HeroImage from 'assets/images/contact-visual.svg';

import styles from './styles.scss';

const Contact = () => {
    return (
        <div className={styles.container}>
            <NavBar />
            <Container>
                <section className={styles.contactHero}>
                    <div className={styles.textSection}>
                        <span className={styles.subTitle}>
                            <Localize>CONTACT AND FEEDBACK</Localize>
                        </span>
                        <div>
                            <h1 className={styles.title}>
                                <Localize>Share your feedback with us</Localize>
                            </h1>
                            <p className={styles.heroPara}>
                                <Localize>
                                    To continuously improve the NEAT+ and adapt it to user’s needs, we would like to learn more about your experience as a user and the context in which you used the tool in. Take 10 minutes to fill out
                                </Localize>
                                <a className={styles.innerLink} target="_blank" rel="noreferrer" href="https://forms.gle/tAQshsUyCHxtweGQ8"> <Localize>this NEAT+ user feedback form.</Localize> </a>
                                <Localize>
                                    All responses are confidential and anonymous.
                                </Localize>
                            </p>
                            <p className={styles.heroPara}>
                                <Localize>
                                    If you have any further questions, comment or feedback, please contact the JEU</Localize> (
                                <a className={styles.innerLink} href="mailto:ochaunep@un.org">ochaunep@un.org</a>).
                            </p>
                        </div>
                    </div>
                    <img className={styles.visual} src={HeroImage} alt={_('Contact Visual Chat Display')} />  
                </section>
            </Container>
            <Footer />
        </div>
    );
};

export default Contact;

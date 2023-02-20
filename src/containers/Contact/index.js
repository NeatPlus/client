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
                                <Localize
                                    text="To continuously improve the NEAT+ and adapt it to user's needs, we would like to learn more about your experience as a user and the context in which you used the tool in. Take 10 minutes to fill out this {{ formLink:NEAT+ user feedback form }}. All responses are confidential and anonymous."
                                    formLink={<a
                                        className={styles.innerLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://docs.google.com/forms/d/1yZ8Mz8jWQepk2DhGH13fKKNQ65QvUEPm7HoXq_uwJEw/viewform?edit_requested=true"
                                    />}
                                />
                            </p>
                            <p className={styles.heroPara}>
                                <Localize
                                    text="If you have any further questions, comment or feedback, please contact the JEU ({{ link:ochaunep@un.org }})."
                                    link={<a className={styles.innerLink} href="mailto:ochaunep@un.org" />}
                                />
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

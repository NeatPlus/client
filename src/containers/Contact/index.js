import NavBar from 'components/NavBar';
import Footer from 'components/Footer';

import HeroImage from 'assets/images/contact-visual.svg';

import styles from './styles.scss';

const Contact = () => {
    return (
        <div className={styles.container}>
            <NavBar />
            <section className={styles.contactHero}>
                <div className={styles.textSection}>
                    <span className={styles.subTitle}>CONTACT AND FEEDBACK</span>
                    <div>
                        <h1 className={styles.title}>
                            Share your feedback with us
                        </h1>
                        <p className={styles.heroPara}>
                            To continuously improve the NEAT+ and adapt it to user’s needs, we would like to learn more about your experience as a user and the context in which you used the tool in. Take 10 minutes to fill out  
                            <a className={styles.innerLink} href="#">this NEAT+ user feedback form</a>. All responses are confidential and anonymous.
                        </p>
                        <p className={styles.heroPara}>
                            If you have any further questions, comment or feedback, please contact the JEU (
                            <a className={styles.innerLink} href="mailto:ochaunep@un.org">ochaunep@un.org</a>).
                        </p>
                    </div>
                </div>
                <img className={styles.visual} src={HeroImage} alt="contact visual chat display" />  
            </section>
            <Footer />
        </div>
    );
};

export default Contact;


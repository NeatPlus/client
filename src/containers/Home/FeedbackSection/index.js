import feedbackImage from 'assets/images/feedback.svg';

import styles from './styles.scss';

const FeedbackSection = () => {
    return (
        <section className={styles.container}>
            <div className={styles.textSection}>
                <h1 className={styles.title}>Share your feedback with us</h1>
                <p className={styles.desc}>To continuously improve the NEAT+ and adapt it to user’s needs, we would like to learn more about your experience as a user and the context in which you used the tool in. Take 10 minutes to fill out this 
                    <a href="#" className={styles.descLink}> NEAT+ user feedback form</a>. All responses are confidential and anonymous.
                </p>
                <p className={styles.desc}>If you have any further questions, comment or feedback, please contact the OCHA/UNEP Joint Environment Unit (JEU)] (
                    <a className={styles.descLink} href="mailto:ochaunep@un.org">ochaunep@un.org</a>).
                </p>
            </div>
            <img src={feedbackImage} alt="feedback" />
        </section>
    );
};

export default FeedbackSection;

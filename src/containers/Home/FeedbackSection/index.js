import {Localize} from '@ra/components/I18n';

import feedbackImage from 'assets/images/feedback.svg';

import styles from './styles.scss';

const FeedbackSection = () => {
    return (
        <section className={styles.feedbackContainer}>
            <div className={styles.feedback}>
                <div className={styles.textSection}>
                    <h1 className={styles.title}><Localize>Share your feedback with us</Localize></h1>
                    <p className={styles.desc}>
                        <Localize
                            text="To continuously improve the NEAT+ and adapt it to user's needs, we would like to learn more about your experience as a user and the context in which you used the tool in. Take less than 5 minutes to fill out this {{ formLink:NEAT+ user feedback form }}. All responses are confidential and anonymous."
                            formLink={<a
                                className={styles.descLink}
                                target="_blank"
                                rel="noreferrer"
                                href="https://docs.google.com/forms/d/1yZ8Mz8jWQepk2DhGH13fKKNQ65QvUEPm7HoXq_uwJEw/viewform?edit_requested=true"
                            />}
                        />
                    </p>
                    <p className={styles.desc}>
                        <Localize
                            text="If you have any further questions, comments or feedback, please contact the OCHA/UNEP Joint Environment Unit (JEU) ({{ link:ochaunep@un.org }})."
                            link={<a className={styles.descLink} href="mailto:ochaunep@un.org" />}
                        />
                    </p>
                </div>
                <div className={styles.img}>
                    <img src={feedbackImage} alt="feedback" />
                </div>
            </div>
        </section>
    );
};

export default FeedbackSection;

import notification from 'assets/images/notification.png';
import styles from './styles.scss';

const NoNotification = ({title, text}) => {
    return (
        <div className={styles.noNotification}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.imageCont}>
                <img
                    src={notification}
                    alt='notification'
                    className={styles.image}
                />
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    );
};

export default NoNotification;

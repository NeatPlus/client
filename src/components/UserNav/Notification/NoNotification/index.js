import {memo} from 'react';
import notification from 'assets/images/notification.png';
import styles from './styles.scss';

const NoNotificationComponent = ({placeholder}) => {
    return (
        <div className={styles.container}>
            <img
                src={notification}
                alt='notification'
                className={styles.image}
            />
            <div className={styles.text}>{placeholder}</div>
        </div>
    );
};

const NoNotification = memo(NoNotificationComponent);

export default NoNotification;

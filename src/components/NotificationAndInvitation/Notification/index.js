import {MdClose} from 'react-icons/md';
import {BsCheck} from 'react-icons/bs';
import cs from '@ra/cs';
import NoNotification from '../NoNotification';
import styles from './styles.scss';

const icons = {
    new_project: <BsCheck className={cs(styles.icon, styles.check)} />,
    rejected: <MdClose className={cs(styles.icon, styles.close)} />,
};

const Notification = ({notifications, handleMarkAllAsRead, clicked}) => {
    if (clicked !== 'notification') return null;
    return (
        <>
            {!notifications.length ? (
                <NoNotification text='No Notifications' />
            ) : (
                <>
                    <div className={styles.container}>
                        {notifications.map((item) => (
                            <div className={styles.notification} key={item.id}>
                                <div className={styles.iconContainer}>
                                    {icons[item.notificationType]}
                                </div>
                                <p className={styles.description}>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.footer}>
                        <p
                            className={styles.footerText}
                            onClick={handleMarkAllAsRead}
                        >
                            Mark all as read
                        </p>
                    </div>
                </>
            )}
        </>
    );
};

export default Notification;

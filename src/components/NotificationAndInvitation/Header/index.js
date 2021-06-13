import cs from '@ra/cs';
import styles from './styles.scss';

const Header = ({clicked, handleNotification, handleInvitation, count}) => {
    return (
        <div className={styles.header}>
            <h2
                className={cs(
                    styles.title,
                    clicked === 'notification' && styles.titleActive
                )}
                onClick={handleNotification}
            >
                Notifications
            </h2>
            <h2
                className={cs(
                    styles.title,
                    clicked === 'invitation' && styles.titleActive
                )}
                onClick={handleInvitation}
            >
                Invitations({count})
            </h2>
        </div>
    );
};

export default Header;

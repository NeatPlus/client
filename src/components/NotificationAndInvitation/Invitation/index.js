import {useCallback} from 'react';
import {BsPersonPlusFill} from 'react-icons/bs';
import Button from 'components/Button';
import NoNotification from '../NoNotification';
import styles from './styles.scss';

const Invitation = ({invitations, clicked}) => {
    const handleAccept = useCallback(() => {
        alert('Accepted');
    }, []);

    const handleDecline = useCallback(() => {
        alert('Declined');
    }, []);

    if (clicked !== 'invitation') return null;
    return (
        <>
            {!invitations.length ? (
                <NoNotification text='No Invitations' />
            ) : (
                <div className={styles.container}>
                    {invitations.map((item) => (
                        <div className={styles.invitation} key={item.id}>
                            <div className={styles.iconContainer}>
                                <BsPersonPlusFill
                                    size={20}
                                    className={styles.personIcon}
                                />
                            </div>
                            <div className={styles.descriptionContainer}>
                                <p className={styles.description}>
                                    {item.description}
                                </p>
                                <div className={styles.buttons}>
                                    <Button
                                        className={styles.button}
                                        type='button'
                                        onClick={handleAccept}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        className={styles.button}
                                        type='button'
                                        secondary
                                        onClick={handleDecline}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Invitation;

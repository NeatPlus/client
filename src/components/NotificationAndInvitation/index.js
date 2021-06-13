import {useCallback, useState, useEffect} from 'react';

import Header from './Header';
import Notification from './Notification';
import Invitation from './Invitation';
import useRequest from 'hooks/useRequest';
import NoNotification from './NoNotification';

import styles from './styles.scss';

const NotificationAndInvitation = (props) => {
    const {isVisible} = props;
    const [clicked, setClicked] = useState('notification');
    const [state, getNotification] = useRequest('/notification/');
    const [state2, getProject] = useRequest('/project/');
    const [, markAllAsRead] = useRequest('/notification/mark_all_as_read/', {
        method: 'POST',
    });

    useEffect(() => {
        getNotification();
        getProject();
    }, [getNotification, getProject]);

    const handleMarkAllAsRead = useCallback(async () => {
        await markAllAsRead();
        await getNotification();
    }, [markAllAsRead, getNotification]);

    const handleNotification = useCallback(() => {
        setClicked('notification');
    }, []);

    const handleInvitation = useCallback(() => {
        setClicked('invitation');
    }, []);

    if (!isVisible) return null;
    return (
        <div className={styles.container}>
            {console.log('notification', state)}
            {console.log('porject', state2)}
            <div className={styles.notificationInvitation}>
                {state.data && state2.data ? (
                    <>
                        <Header
                            clicked={clicked}
                            handleInvitation={handleInvitation}
                            handleNotification={handleNotification}
                            count={state2.data.count}
                        />
                        <Notification
                            clicked={clicked}
                            notifications={state.data.results}
                            handleMarkAllAsRead={handleMarkAllAsRead}
                        />
                        <Invitation
                            clicked={clicked}
                            invitations={state2.data.results}
                        />
                    </>
                ) : (
                    <NoNotification
                        title='Notifications'
                        text='No Notifications'
                    />
                )}
            </div>
        </div>
    );
};

export default NotificationAndInvitation;

import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';

import Tabs, {Tab} from '@ra/components/Tabs';
import cs from '@ra/cs';
import useRequest from '@ra/services/useRequest';

import Api from 'services/api';
import useInterval from 'hooks/useInterval';

import Notification from './Notification';
import Invitation from './Invitation';

import styles from './styles.scss';

const NotificationCard = React.forwardRef(({openNotification}, ref) => {
    const [, getNotification] =
        useRequest(Api.getNotifications);

    const [, getProjectInvitations] = useRequest(Api.getProjectInvitations);

    useInterval(() => {
        getNotification();
        getProjectInvitations();
    }, 20000);

    const {notifications, invitations} = useSelector(state => state.notification);
    const handleMarkAllAsRead = useCallback(async () => {
        await Api.markAllAsRead();
        await getNotification();
    }, [getNotification]);

    const renderTabsHeader = useCallback((tabHeaderProps) => {
        const {title, active, ...rest} = tabHeaderProps;
        return (
            <div
                className={cs(styles.headerItem, {
                    [styles.headerItemActive]: active,
                })}
                {...rest}
            >
                {title}
            </div>
        );
    }, []);

    return (
        <div
            className={cs(styles.container, {
                [styles.open]: openNotification,
            })}
        >
            <div ref={ref} className={styles.tabsContainer}>
                <Tabs
                    className={styles.tabs}
                    renderHeader={renderTabsHeader}
                    headerClassName={styles.tabsHeader}
                    defaultActiveTab='notification'
                >
                    <Tab label='notification' title='Notifications'>
                        <Notification
                            notifications={notifications}
                            handleMarkAllAsRead={handleMarkAllAsRead}
                        />
                    </Tab>
                    <Tab
                        label='invitation'
                        title={`Invitations (${invitations?.length})`}
                    >
                        <Invitation invitations={invitations} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
});

export default NotificationCard;

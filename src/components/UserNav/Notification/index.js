import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';

import Tabs, {Tab} from '@ra/components/Tabs';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import Api from 'services/api';
import useInterval from 'hooks/useInterval';

import Notification from './Notification';
import Invitation from './Invitation';

import styles from './styles.scss';

const NotificationCard = React.forwardRef(({openNotification}, ref) => {
    const [, getNotification] =
        usePromise(Api.getNotifications);

    const [, getProjectInvitations] = usePromise(Api.getProjectInvitations);

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
                    <Tab label='notification' title={_('Notifications')}>
                        <Notification
                            notifications={notifications}
                            handleMarkAllAsRead={handleMarkAllAsRead}
                        />
                    </Tab>
                    <Tab
                        label='invitation'
                        title={`${_('Invitations')} (${invitations?.length})`}
                    >
                        <Invitation invitations={invitations} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
});

export default NotificationCard;

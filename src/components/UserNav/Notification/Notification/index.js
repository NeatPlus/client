import {useCallback, useMemo} from 'react';
import {MdClose} from 'react-icons/md';
import {BsCheck} from 'react-icons/bs';
import {AiOutlineNotification} from 'react-icons/ai';

import cs from '@ra/cs';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import NoNotification from '../NoNotification';

import styles from './styles.scss';

const icons = {
    project_accepted: <BsCheck className={cs(styles.icon, styles.check)} />,
    project_rejected: <MdClose className={cs(styles.icon, styles.close)} />,
    default: <AiOutlineNotification className={cs(styles.icon)} />,
};

const Notification = ({notifications, handleMarkAllAsRead}) => {
    const keyExtractor = useCallback((item, index) => {
        return index;
    }, []);

    const renderNotification = useCallback(({item}) => {
        const icon = icons[item.notificationType] || icons.default;

        return (
            <div className={styles.notification} key={item.id}>
                <div className={styles.iconContainer}>
                    {icon}
                </div>
                <p className={styles.description}>{item.description}</p>
            </div>
        );
    }, []);

    const EmptyComponent =useMemo(() => <NoNotification placeholder={_('No Notifications')} />, []);

    return (
        <>
            <List
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={keyExtractor}
                className={styles.container}
                EmptyComponent={EmptyComponent}
            />
            {notifications.length > 1 && (
                <div className={styles.footer}>
                    <p className={styles.footerText} onClick={handleMarkAllAsRead}>
                        <Localize>Mark all as read</Localize>
                    </p>
                </div>
            )}
        </>
    );
};

export default Notification;

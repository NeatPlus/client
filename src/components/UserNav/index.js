import {useCallback, useRef, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {IoNotificationsOutline, IoSettingsOutline} from 'react-icons/io5';
import {IoMdLogOut} from 'react-icons/io';
import {MdLanguage} from 'react-icons/md';
import {BiHelpCircle} from 'react-icons/bi';

import Dropdown from '@ra/components/Dropdown';
import Notification from './Notification';

import OrganizationIcon from 'assets/icons/organization.svg';
import logo from 'assets/images/logo-dark.svg';
import {logout} from 'store/actions/auth';

import styles from './styles.scss';

const UserNav = (props) => {
    const {renderCenterContent: CenterContent} = props;
    const [openNotification, setOpenNotification] = useState(false);
    const notificationsRef = useRef(null);

    const history = useHistory();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);

    const hideNotification = useCallback((event) => {
        if (notificationsRef.current && !notificationsRef.current.contains(event?.target)) {
            setOpenNotification(false);
            document.removeEventListener('click', hideNotification);
        }
    }, []);

    const showNotification = useCallback(() => {
        setOpenNotification(true);
        setTimeout(() => {
            document.addEventListener('click', hideNotification);
        }, 50);
    }, [hideNotification]);

    const onClick = useCallback(() => {
        openNotification ? hideNotification() : showNotification();
    }, [hideNotification, openNotification, showNotification]);

    const handleLogOut = useCallback(() => {
        dispatch(logout());
        history.push('/');
    }, [dispatch, history]);

    const getInitial = useCallback(() => user?.firstName?.[0], [user]);

    return (
        <nav className={styles.container}>
            <Link to='/'>
                <img className={styles.logo} src={logo} alt='Neat+ Logo' />
            </Link>
            {CenterContent && <CenterContent />}
            <div className={styles.rightContent}>
                <Notification
                    openNotification={openNotification}
                    ref={notificationsRef}
                />
                <IoNotificationsOutline
                    size='20px'
                    className={styles.notificationIcon}
                    onClick={onClick}
                />
                <Dropdown
                    labelContainerClassName={styles.userAvatar}
                    renderLabel={getInitial}
                    align='right'
                >
                    <div className={styles.userOptions}>
                        <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                                {getInitial()}
                            </div>
                            <div className={styles.userData}>
                                <p className={styles.name}>
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className={styles.email}>{user?.email}</p>
                            </div>
                        </div>
                        <Link to='/organizations' className={styles.userOption}>
                            <img 
                                src={OrganizationIcon} 
                                className={styles.userIcon} 
                                alt="organization"
                            />
                            Organizations
                        </Link>
                        <Link to='/account' className={styles.userOption}>
                            <IoSettingsOutline className={styles.userIcon} />
                            Account Settings
                        </Link>
                        <div className={styles.userOption}>
                            <MdLanguage className={styles.userIcon} />
                            Language
                        </div>
                        <div className={styles.userOption}>
                            <BiHelpCircle className={styles.userIcon} />
                            Help
                        </div>
                        <div
                            className={styles.userOption}
                            onClick={handleLogOut}
                        >
                            <IoMdLogOut className={styles.userIcon} />
                            Log out
                        </div>
                    </div>
                </Dropdown>
            </div>
        </nav>
    );
};

export default UserNav;

import {useCallback, useRef, useState, useMemo} from 'react';
import {Link, useHistory, useRouteMatch} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {
    IoNotificationsOutline, 
    IoSettingsOutline, 
} from 'react-icons/io5';
import {IoMdLogOut} from 'react-icons/io';
import {MdLanguage} from 'react-icons/md';
import {BiHelpCircle, BiShareAlt} from 'react-icons/bi';

import ShareSurvey from 'components/ShareSurvey';
import Dropdown from '@ra/components/Dropdown';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import OrganizationIcon from 'assets/icons/organization.svg';
import logo from 'assets/images/logo-dark.svg';

import cs from '@ra/cs';
import {logout} from 'store/actions/auth';

import Notification from './Notification';

import styles from './styles.scss';

const UserNav = (props) => {
    const [openNotification, setOpenNotification] = useState(false);
    const notificationsRef = useRef(null);

    const history = useHistory();
    const dispatch = useDispatch();

    const {user} = useSelector(state => state.auth);
    const {activeSurvey} = useSelector(state => state.survey);

    const match = useRouteMatch({
        path: '/projects/:projectId/surveys/:surveyId/',
    });
    const isSurveyPath = useMemo(() => match?.isExact && activeSurvey, [activeSurvey, match]);

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

    const renderShareLabel = useCallback(() => {
        return (
            <>
                <BiShareAlt
                    size={21}
                    className={styles.actionIcon}
                />
                {activeSurvey?.isSharedPublicly && (
                    <div className={styles.publicText}>
                        <Localize>PUBLIC</Localize>
                    </div>
                )}
            </>
        );
    }, [activeSurvey]);

    return (
        <nav className={styles.container}>
            <Link to='/'>
                <img className={styles.logo} src={logo} alt={_('Neat+ Logo')} />
            </Link>
            {isSurveyPath && <h1 className={styles.title}>{activeSurvey?.title}</h1>}
            <div className={cs(styles.rightContent, 'no-print')}>
                {isSurveyPath && (
                    <Dropdown 
                        className={styles.shareDropdown}
                        labelContainerClassName={styles.shareIconContainer} 
                        align="right" 
                        renderLabel={renderShareLabel}
                    >
                        <ShareSurvey />
                    </Dropdown>
                )}
                <Notification
                    openNotification={openNotification}
                    ref={notificationsRef}
                />
                <IoNotificationsOutline
                    size={20}
                    className={cs(styles.actionIcon, styles.notificationIcon)}
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
                            <Localize>Organizations</Localize>
                        </Link>
                        <Link to='/account' className={styles.userOption}>
                            <IoSettingsOutline className={styles.userIcon} />
                            <Localize>Account Settings</Localize>
                        </Link>
                        <div className={styles.userOption}>
                            <MdLanguage className={styles.userIcon} />
                            <Localize>Language</Localize>
                        </div>
                        <div className={styles.userOption}>
                            <BiHelpCircle className={styles.userIcon} />
                            <Localize>Help</Localize>
                        </div>
                        <div
                            className={styles.userOption}
                            onClick={handleLogOut}
                        >
                            <IoMdLogOut className={styles.userIcon} />
                            <Localize>Log out</Localize>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </nav>
    );
};

export default UserNav;

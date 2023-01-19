import {useCallback, useRef, useState, useMemo} from 'react';
import {Link, useHistory, useRouteMatch} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {
    IoNotificationsOutline, 
    IoSettingsOutline, 
} from 'react-icons/io5';
import {IoMdLogOut} from 'react-icons/io';
import {MdOutlineAdminPanelSettings, MdOutlineListAlt} from 'react-icons/md';
import {BiShareAlt} from 'react-icons/bi';

import ShareSurvey from 'components/ShareSurvey';
import Dropdown from '@ra/components/Dropdown';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import OrganizationIcon from 'assets/icons/organization.svg';
import logo from 'assets/images/logo-dark.svg';

import cs from '@ra/cs';
import {logout} from 'store/actions/auth';
import usePermissions from 'hooks/usePermissions';
import {weightagePermissions} from 'utils/permission';

import Notification from './Notification';

import styles from './styles.scss';

const UserNav = (props) => {
    const [openNotification, setOpenNotification] = useState(false);
    const notificationsRef = useRef(null);

    const history = useHistory();
    const dispatch = useDispatch();

    const {user} = useSelector(state => state.auth);
    const {activeProject} = useSelector(state => state.project);
    const {activeSurvey} = useSelector(state => state.survey);

    const {notifications=[], invitations=[]} = useSelector(state => state.notification);
    const hasUnreadNotifications = useMemo(() => {
        return notifications.some(noti => !noti.hasRead) || invitations.some(inv => inv.status === 'pending');
    }, [notifications, invitations]);

    const projectMatch = useRouteMatch({path: '/projects/:projectId/', strict: true});
    const isProjectPath = useMemo(() => projectMatch && activeProject, [projectMatch, activeProject]);

    const match = useRouteMatch({
        path: '/projects/:projectId/surveys/:surveyId/',
    });
    const isSurveyPath = useMemo(() => match && activeSurvey, [activeSurvey, match]);

    const isAdminRoute = useRouteMatch({
        path: '/administration/',
    });

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

    const handleNotificationClick = useCallback(() => {
        openNotification ? hideNotification() : showNotification();
    }, [hideNotification, openNotification, showNotification]);

    const handleLogOut = useCallback(() => {
        dispatch(logout());
        history.push('/');
    }, [dispatch, history]);

    const getInitial = useCallback(() => user?.firstName?.[0], [user]);

    const [hasWeightagePermissions] = usePermissions(weightagePermissions);
    const showAdministration = useMemo(() => !isAdminRoute && (hasWeightagePermissions || user?.isSuperuser), [hasWeightagePermissions, user, isAdminRoute]);

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
            {isSurveyPath ? (
                <h1 className={styles.title}>
                    {activeSurvey?.title}
                </h1>
            ) : isProjectPath ? (
                <h1 className={styles.title}>
                    {activeProject?.title}
                </h1>
            ) : null}
            <div className={cs(styles.rightContent, 'no-print')}>
                {isSurveyPath && (
                    <Dropdown 
                        className={styles.shareDropdown}
                        labelContainerClassName={styles.shareIconContainer} 
                        align="right" 
                        renderLabel={renderShareLabel}
                        useCapture={false}
                    >
                        <ShareSurvey />
                    </Dropdown>
                )}
                <Notification
                    openNotification={openNotification}
                    ref={notificationsRef}
                />
                <div className={styles.notificationsContainer} onClick={handleNotificationClick}>
                    <IoNotificationsOutline
                        size={20}
                        className={cs(styles.actionIcon, styles.notificationIcon)}
                    />
                    {hasUnreadNotifications && (
                        <div className={styles.notificationsIndicator} />
                    )}
                </div>
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
                        {showAdministration && (
                            <Link to='/administration' className={styles.userOption}>
                                <MdOutlineAdminPanelSettings className={styles.userIcon} />
                                <Localize>Administration</Localize>
                            </Link>
                        )}
                        {isAdminRoute && (
                            <Link to='/projects' className={styles.userOption}>
                                <MdOutlineListAlt className={styles.userIcon} />
                                <Localize>Projects</Localize>
                            </Link>
                        )}
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
                        {/* TODO: Language action
                        <div className={styles.userOption}>
                            <MdLanguage className={styles.userIcon} />
                            <Localize>Language</Localize>
                        </div>
                        */}
                        {/* TODO: Help action
                        <div className={styles.userOption}>
                            <BiHelpCircle className={styles.userIcon} />
                            <Localize>Help</Localize>
                        </div>
                        */}
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

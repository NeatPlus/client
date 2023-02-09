import {useCallback, useRef, useState, useMemo} from 'react';
import {Link, useNavigate, useMatch, useParams} from 'react-router-dom';
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
import ProjectSearch from './ProjectSearch';

import styles from './styles.scss';

const UserNav = ({searchQuery, onSearchQueryChange}) => {
    const [openNotification, setOpenNotification] = useState(false);
    const notificationsRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {projectId, surveyId} = useParams();

    const {user} = useSelector(state => state.auth);
    const {activeProject} = useSelector(state => state.project);
    const {activeSurvey} = useSelector(state => state.survey);

    const {notifications=[], invitations=[]} = useSelector(state => state.notification);
    const hasUnreadNotifications = useMemo(() => {
        return notifications.some(noti => !noti.hasRead) || invitations.some(inv => inv.status === 'pending');
    }, [notifications, invitations]);

    const projectTableMatch = useMatch({path: '/projects/', end: true});

    const projectMatch = useMatch({path: '/projects/:projectId/', end: true});
    const projectSurveysMatch = useMatch({path: '/projects/:projectId/surveys/', end: true});
    const isProjectPath = useMemo(() => (projectSurveysMatch || projectMatch) && activeProject && activeProject.id === +projectId, [projectSurveysMatch, projectId, projectMatch, activeProject]);

    const match = useMatch({
        path: '/projects/:projectId/surveys/:surveyId/',
    });
    const isSurveyPath = useMemo(() => match && activeSurvey && activeSurvey.id === +surveyId, [surveyId, activeSurvey, match]);

    const isAdminRoute = useMatch({
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
        navigate('/');
    }, [dispatch, navigate]);

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

    const activeProjectTitle = useMemo(() => {
        if(!activeProject?.title) {
            return null;
        }
        if(activeProject.title?.length > 80) {
            return activeProject.title.slice(0, 80) + '...';
        }
        return activeProject?.title || '';
    }, [activeProject]);

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
                <h1 className={styles.title} title={activeProject?.title || ''}>
                    {activeProjectTitle}
                </h1>
            ) : projectTableMatch ? (
                <ProjectSearch query={searchQuery} onChange={onSearchQueryChange} />
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
                <button type="button" className={styles.notificationsContainer} onClick={handleNotificationClick}>
                    <IoNotificationsOutline
                        size={20}
                        className={cs(styles.actionIcon, styles.notificationIcon)}
                    />
                    {hasUnreadNotifications && (
                        <div className={styles.notificationsIndicator} />
                    )}
                </button>
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

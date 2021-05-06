import {Link} from 'react-router-dom';
import {IoNotificationsOutline} from 'react-icons/io5';

import logo from 'assets/images/logo-dark.svg';

import styles from './styles.scss';

const UserNav = props => {
    const {renderCenterContent: CenterContent} = props;
    
    return (
        <nav className={styles.container}>
            <Link to="/">
                <img className={styles.logo} src={logo} alt="Neat+ Logo" />
            </Link>
            {CenterContent && <CenterContent />}
            <div className={styles.rightContent}>
                <IoNotificationsOutline size="20px" className={styles.notificationIcon} />
                <div className={styles.userAvatar}>
                    A {/* FIXME: Use user initial */}
                </div>
            </div>
        </nav>
    );
};

export default UserNav;

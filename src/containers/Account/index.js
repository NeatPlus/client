import { Route, Switch, NavLink } from 'react-router-dom';
import UserNav from 'components/UserNav';

import { IoIosArrowBack } from 'react-icons/io';
import { BiUser } from 'react-icons/bi';
import { AiOutlineLock } from 'react-icons/ai';


import AccountSetting from './AccountSetting';
import ChangePassword from './ChangePassword';

import styles from './styles.scss';

const Account = () => {

    return (
        <div className={styles.account}>
            <UserNav />
            <div className={styles.container}>
                <div className={styles.content}>
                    <a href="#" className={styles.backLink}>
                        <IoIosArrowBack size="20px" />
                        <span>BACK</span>
                    </a>
                    <h1 class={styles.title}>Account Setting</h1>
                    <div className={styles.mainSettings}>
                        <div className={styles.panels}>
                            <NavLink to="/account/setting/" activeClassName={styles.panelActive} className={styles.panelItem}>
                                <BiUser size="20px" className={`${styles.panelIcon} ${styles.panelIconActive}`} />
                                <span>Account</span>
                            </NavLink>
                            <NavLink to="/account/password/" activeClassName={styles.panelActive} className={styles.panelItem}>
                                <AiOutlineLock size="20px" className={`${styles.panelIcon} ${styles.panelIconActive}`} />
                                <span>Password</span>
                            </NavLink>
                        </div>
                        <Switch>
                            <Route exact path='/account/setting/' component={AccountSetting} />
                            <Route exact path='/account/password/' component={ChangePassword} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Account;

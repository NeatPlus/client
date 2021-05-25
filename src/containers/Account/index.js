import {useCallback, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

import {IoIosArrowBack} from 'react-icons/io';
import {BiUser} from 'react-icons/bi';
import {AiOutlineLock} from 'react-icons/ai';

import UserNav from 'components/UserNav';

import UpdateInfo from './UpdateInfo';
import UpdatePassword from './UpdatePassword';
import styles from './styles.scss';

const Account = () => {
    const [route, setRoute] = useState('account');
    useCallback(() => {
        return route;
    }, [route]);
    const history = useHistory();

    return (
        <div className={styles.container}>
            <UserNav />
            <div className={styles.settings}>
                <div className={styles.textSection}>
                    <Link onClick={() => history.goBack()} to="#" className={styles.backLink}>
                        <IoIosArrowBack size="20px" /> Back
                    </Link>
                    <h1 className={styles.title}>
                        Account Settings
                    </h1>
                </div>
                <div className={styles.mainSection}>
                    <div className={styles.panels}>
                        <div onClick={() =>setRoute('account')} className={`${route==='account' && styles.panelItemActive} ${styles.panelItem}`}>
                            <BiUser size="20px" className={styles.panelIcon} />
                            <span>Account</span>
                        </div>
                        <div onClick={()=>setRoute('password')} className={`${route==='password' && styles.panelItemActive} ${styles.panelItem}`}>
                            <AiOutlineLock size="20px" className={styles.panelIcon} />
                            <span>Password</span>
                        </div>
                    </div>
                    <div className={styles.editSection}>
                        {route==='account' ? <UpdateInfo /> : <UpdatePassword/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;

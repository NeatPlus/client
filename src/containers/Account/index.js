import {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {IoIosArrowBack} from 'react-icons/io';
import {BiUser} from 'react-icons/bi';
import {AiOutlineLock} from 'react-icons/ai';

import UserNav from 'components/UserNav';

import cs from '@ra/cs';

import UpdateInfo from './UpdateInfo';
import UpdatePassword from './UpdatePassword';
import styles from './styles.scss';

const Account = () => {
    const [route, setRoute] = useState('account');
    const history = useHistory();

    const handleAccountClick = useCallback(() => setRoute('account'), []);
    const handlePasswordClick = useCallback(() => setRoute('password'), []);
    const handleGoBack = useCallback(() => history.goBack(), [history]);

    return (
        <div className={styles.container}>
            <UserNav />
            <div className={styles.settings}>
                <div className={styles.textSection}>
                    <div onClick={handleGoBack} className={styles.backLink}>
                        <IoIosArrowBack className={styles.backIcon} size={20} /> BACK
                    </div>
                    <h1 className={styles.title}>
                        Account Settings
                    </h1>
                </div>
                <div className={styles.mainSection}>
                    <div className={styles.panels}>
                        <div 
                            onClick={handleAccountClick} 
                            className={cs(styles.panelItem, {
                                [styles.panelItemActive]: route==='account',
                            })}>
                            <BiUser size="20px" className={styles.panelIcon} />
                            <span>Account</span>
                        </div>
                        <div 
                            onClick={handlePasswordClick} 
                            className={cs(styles.panelItem, {
                                [styles.panelItemActive]: route==='password',
                            })}>
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

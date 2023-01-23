import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {IoIosArrowBack} from 'react-icons/io';
import {BiUser} from 'react-icons/bi';
import {AiOutlineLock} from 'react-icons/ai';

import UserNav from 'components/UserNav';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';

import UpdateInfo from './UpdateInfo';
import UpdatePassword from './UpdatePassword';
import styles from './styles.scss';

const Account = () => {
    const [route, setRoute] = useState('account');
    const navigate = useNavigate();

    const handleAccountClick = useCallback(() => setRoute('account'), []);
    const handlePasswordClick = useCallback(() => setRoute('password'), []);
    const handleGoBack = useCallback(() => navigate(-1), [navigate]);

    return (
        <div className={styles.container}>
            <UserNav />
            <div className={styles.settings}>
                <div className={styles.textSection}>
                    <div onClick={handleGoBack} className={styles.backLink}>
                        <IoIosArrowBack className={styles.backIcon} size={20} /> <Localize>BACK</Localize>
                    </div>
                    <h1 className={styles.title}>
                        <Localize>Account Settings</Localize>
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
                            <span><Localize>Account</Localize></span>
                        </div>
                        <div 
                            onClick={handlePasswordClick} 
                            className={cs(styles.panelItem, {
                                [styles.panelItemActive]: route==='password',
                            })}>
                            <AiOutlineLock size="20px" className={styles.panelIcon} />
                            <span><Localize>Password</Localize></span>
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

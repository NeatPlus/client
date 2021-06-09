import {useSelector} from 'react-redux';

import Button from 'components/Button';

import styles from './styles.scss';

const AccountInfo = (props) => {
    const {user} = useSelector((state) => state.auth);

    return (
        <div className={styles.accountInfo}>
            <div className={styles.userInfo}>
                <div className={styles.userAvatar}>{user?.firstName?.[0]}</div>
                <span className={styles.userName}>
                    {`${user?.firstName} ${user?.lastName}`}
                </span>
            </div>
            <Button loading={props.loading}>{props.actionTitle}</Button>
        </div>
    );
};
export default AccountInfo;

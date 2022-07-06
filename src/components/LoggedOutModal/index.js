import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import withVisibleCheck from '@ra/components/WithVisibleCheck';
import Modal from '@ra/components/Modal';
import {Localize} from '@ra/components/I18n';

import {_} from 'services/i18n';
import {hideExpiryModal} from 'store/actions/ui';
import expireIcon from 'assets/images/no-project.svg';

import styles from './styles.scss';

const LoggedOutModal = (props) => {
    const dispatch = useDispatch();

    const onClose = useCallback(() => {
        dispatch(hideExpiryModal());
    }, [dispatch]);

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Session Expired</Localize></h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.deleteContent}>
                    <img
                        className={styles.deleteImage}
                        src={expireIcon}
                        alt={_('Session Expired')}
                    />
                    <p className={styles.deleteText}>
                        <Localize>Your session has expired, and you have been logged out.</Localize>
                    </p>
                </div>
                <div className={styles.buttons}>
                    <Button onClick={onClose}>
                        <Localize>OK</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default withVisibleCheck(LoggedOutModal);

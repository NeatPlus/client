import React, {useState, useCallback} from 'react';
import {FaTimes} from 'react-icons/fa';
import {MdClose} from 'react-icons/md';

import Modal from '@ra/components/Modal';

import styles from './styles.scss';

const Notice = () => {
    const notice = {
        title: 'Please wait until next week (5 July 2021) to conduct project surveys.',
        description: ' Please refrain from conducting project surveys until next week (5 July 2021) as the NEAT+ team is finalizing some important back-end components. Another notification will be sent when pilot testing can resume. Thank you for your understanding.'
    };
    const [showNotice, setShowNotice] = useState(true);
    const [showNoticeModal, setShowNoticeModal] = useState(false);

    const handleCloseClick = useCallback(() => setShowNotice(false), []);

    const handleToggleModal = useCallback(() => {
        setShowNoticeModal(!showNoticeModal);
    }, [showNoticeModal]);

    if (notice) {
        return (
            <>
                {showNotice && (
                    <div className={styles.topBar}>
                        <span>{notice.title}</span>
                        <div onClick={handleToggleModal} className={styles.moreLink}>Click here</div>
                        <FaTimes onClick={handleCloseClick} className={styles.closeIcon} />
                    </div>
                )}
                {showNoticeModal && (
                    <Modal className={styles.modal}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{notice.title}</h2>
                            <button className={styles.closeContainer} onClick={handleToggleModal}>
                                <MdClose className={styles.modalCloseIcon} />
                            </button>
                        </div>
                        <div className={styles.content}>
                            <p className={styles.description}>{notice.description}</p>
                        </div>
                    </Modal>
                )}
            </>
        );
    } return null;
};

export default Notice;

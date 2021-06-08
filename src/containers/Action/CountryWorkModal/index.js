import React from 'react';

import {MdClose} from 'react-icons/md';

import parse from 'html-react-parser';

import Modal from '@ra/components/Modal';

import styles from './styles.scss';

const CountryWorkModal = (props) => {
    const {isVisible, onClose, title, description} = props;

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <button className={styles.closeContainer} onClick={onClose}>
                    <MdClose className={styles.closeIcon} />
                </button>
            </div>
            <div className={styles.content}>
                <p className={styles.description}>
                    {parse(String(description || ''))}
                </p>
            </div>
        </Modal>
    );
};

export default CountryWorkModal;

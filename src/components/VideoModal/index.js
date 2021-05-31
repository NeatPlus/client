import {MdClose} from 'react-icons/md';

import Modal from '@ra/components/Modal';
import styles from './styles.scss';

const VideoModal = ({isVisible, onClose, embedId, title}) => {
    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <button onClick={onClose} className={styles.button}>
                    <MdClose size={25} />
                </button>
            </div>
            <div className={styles.video}>
                <iframe
                    width='100%'
                    height='100%'
                    src={`https://www.youtube.com/embed/${embedId}`}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    title='Embedded youtube'
                />
            </div>
        </Modal>
    );
};

export default VideoModal;

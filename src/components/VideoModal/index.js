import {MdClose} from 'react-icons/md';

import Modal from '@ra/components/Modal';
import { localizeFn as _ } from '@ra/components/I18n';

import styles from './styles.scss';

const VideoModal = ({isVisible, onClose, videoUrl, title}) => {
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
                    src={videoUrl}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    title={_('Embedded youtube')}
                />
            </div>
        </Modal>
    );
};

export default VideoModal;

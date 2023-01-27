import {useCallback, useState} from 'react';

import {AiOutlinePlayCircle} from 'react-icons/ai';
import {BiDownload} from 'react-icons/bi';

import VideoModal from 'components/VideoModal';
import Button from 'components/Button';
import {Localize} from '@ra/components/I18n';

import styles from './styles.scss';

const CategoryCard = ({item}) => {
    const {title, description, videoUrl, attachment} = item;

    const [showVideoModal, setShowVideoModal] = useState(false);

    const handleShowVideoModal = useCallback(() => setShowVideoModal(true), []);
    const handleHideVideoModal = useCallback(
        () => setShowVideoModal(false),
        []
    );
    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.title}>{title} </h2>
                <p className={styles.description}>{description}</p>
                {attachment && (
                    <Button
                        className={styles.button}
                        onClick={() => window.open(attachment, '_blank')}
                    >
                        <BiDownload size={20} />
                        <Localize>Download</Localize>
                    </Button>
                )}
                {videoUrl && (
                    <Button
                        className={styles.button}
                        onClick={handleShowVideoModal}
                    >
                        <AiOutlinePlayCircle size={20} />
                        <Localize>Watch Video</Localize>
                    </Button>
                )}
            </div>
            <VideoModal
                videoUrl={videoUrl}
                isVisible={showVideoModal}
                onClose={handleHideVideoModal}
                title={title}
            />
        </>
    );
};

export default CategoryCard;

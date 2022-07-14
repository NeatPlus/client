import {useCallback, useState, useEffect, useRef} from 'react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {IoMdClose} from 'react-icons/io';

import Modal from '@ra/components/Modal';
import Image from '@ra/components/Image';
import List from '@ra/components/List';

import cs from '@ra/cs';

import styles from './styles.scss';

const keyExtractor = (item, idx) => idx;

const KeyCodes = {
    LEFT: 37,
    RIGHT: 39,
    ESCAPE: 27,
};

const ThumbnailImage = props => {
    const {item, index, activeImageIdx, onClick} = props;

    const handleClick = useCallback(() => onClick(index), [index, onClick]);

    return (
        <img
            src={item}
            className={cs(styles.thumbnailImage, {
                [styles.thumbnailImageActive]: index === activeImageIdx,
            })}
            onClick={handleClick}
            alt={`Media ${index}`}
        />
    );
};

const ImageViewerModal = props => {
    const {images=[], initialIndex, onClose, ...modalProps} = props;

    const listRef = useRef();

    const [activeImageIdx, setActiveImageIdx] = useState(initialIndex);

    useEffect(() => {
        setActiveImageIdx(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if(listRef?.current) {
            listRef.current.scrollTo({left: activeImageIdx * 55 - listRef.current.clientWidth / 2, behavior: 'smooth'});
        }
    }, [activeImageIdx]);

    const handlePreviousClick = useCallback(() => {
        setActiveImageIdx(prevValue => prevValue === 0 ? prevValue : prevValue - 1);
    }, []);

    const handleNextClick = useCallback(() => {
        setActiveImageIdx(prevValue => prevValue === images?.length - 1 ? prevValue : prevValue + 1);
    }, [images]);

    const handleKeyPress = useCallback(e => {
        switch(e.which || e.keyCode) {
        case KeyCodes.LEFT:
            handlePreviousClick();
            break;
        case KeyCodes.RIGHT:
            handleNextClick();
            break;
        case KeyCodes.ESCAPE:
            onClose && onClose();
            break;
        default:
            break;
        }
    }, [handlePreviousClick, handleNextClick, onClose]);
   
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const renderThumbnailItem = useCallback(listProps => (
        <ThumbnailImage {...listProps} activeImageIdx={activeImageIdx}  onClick={setActiveImageIdx} />
    ), [activeImageIdx]);

    return (
        <Modal overlayClassName={styles.modalOverlay} className={styles.modal} {...modalProps}>
            <div className={styles.imageViewer}>
                <IoMdClose className={styles.closeIcon} size={42} onClick={onClose} />
                <figure className={styles.mainFigure}>
                    <MdChevronLeft
                        className={cs(styles.controlIcon, styles.controlIconPrev, {
                            [styles.controlIconDisabled]: activeImageIdx === 0,
                        })}
                        size={48}
                        onClick={handlePreviousClick}
                    />
                    <Image key={activeImageIdx} src={images[activeImageIdx]} className={styles.mainImage} />
                    <MdChevronRight
                        className={cs(styles.controlIcon, styles.controlIconNext, {
                            [styles.controlIconDisabled]: activeImageIdx === images?.length - 1,
                        })}
                        size={48}
                        onClick={handleNextClick}
                    />
                </figure>
                <List
                    ref={listRef}
                    data={images}
                    className={styles.thumbnails}
                    keyExtractor={keyExtractor}
                    renderItem={renderThumbnailItem}
                />
            </div>
        </Modal>
    );
};

export default ImageViewerModal;

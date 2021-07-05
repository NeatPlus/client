import {useCallback, useState, useEffect} from 'react';
import {FiChevronRight} from 'react-icons/fi';
import {MdClose} from 'react-icons/md';
import parse from 'html-react-parser';

import useRequest from 'hooks/useRequest';

import Modal from '@ra/components/Modal';
import List from '@ra/components/List';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const ExampleModal = ({description, onClose}) => {
    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
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

const ReadMore = ({ item, handleClick }) => {
    const onClick = useCallback(() => {
        handleClick(item);
    }, [handleClick, item]);
    return (
        <div onClick={onClick} className={styles.readText}>
            <div className={styles.text}>{item?.summary}</div>
            <div className={styles.toggleIcon}>
                <FiChevronRight className={styles.icon} />
            </div>
        </div>
    );
};

const ExampleSection = () => {
    const [{data}, getData] = useRequest('/action/');
    
    useEffect(() => {
        getData();
    }, [getData]);

    const [showExampleModal, setShowExampleModal] = useState(false);
    const [modalData, setModalData] = useState();


    const handleToggleModal = useCallback((item) => {
        setModalData(item);
        setShowExampleModal(!showExampleModal);
    }, [showExampleModal]);

    const renderReadMore = useCallback(({item}) => {
        return (
            <ReadMore
                handleClick={handleToggleModal}
                item={item}
            />
        );
    }, [handleToggleModal]);

    return (
        <section className={styles.container}>
            <h5 className={styles.mainTitle}>NEAT+ APPLICATION</h5>
            <div className={styles.infoWrapper}>
                <div>
                    <h1 className={styles.subTitle}>Examples of the NEAT+ in action by humanitarian organizations</h1>
            
                    <p className={styles.infoDesc}>
                        The NEAT+ has been successfully used and applied by over fifteen humanitarian organizations in over 30 field operations worldwide. With the latest update, the Rural NEAT+ will now be expanding into French- and Spanish-speaking operations in 2021.
                    </p>
                    <p className={styles.infoDesc}>
                        See examples and findings of previous NEAT+ pilots and environmental scoping missions. If you have a report to submit, please contact the UNEP/OCHA Joint Environment Unit (JEU) (ochaunep@un.org). 
                    </p>
                </div>
                <div className={styles.content}>
                    {data?.results?.length > 0 && (
                        <List
                            data={data?.results.slice(0, 4)}
                            renderItem={renderReadMore}
                            keyExtractor={keyExtractor}
                        />
                    )}
                </div>
            </div>
            {showExampleModal && (
                <ExampleModal
                    onClose={handleToggleModal}
                    description={modalData?.description}
                />
            )}
        </section>
    );
};

export default ExampleSection;

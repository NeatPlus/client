import {useCallback, useState, useEffect} from 'react';
import {FiChevronRight} from 'react-icons/fi';
import {MdClose} from 'react-icons/md';
import parse from 'html-react-parser';

import Container from 'components/Container';
import Modal from '@ra/components/Modal';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import useRequest from 'hooks/useRequest';

import styles from './styles.scss';

const keyExtractor = (item) => item.id;

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

const ReadMore = ({item, handleClick}) => {
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

    const getExampleData = useCallback(async () => {
        try {
            await getData();
        } catch (error) {
            console.log(error);
        }
    }, [getData]);

    useEffect(() => {
        getExampleData();
    }, [getExampleData]);

    const [showExampleModal, setShowExampleModal] = useState(false);
    const [modalData, setModalData] = useState();

    const handleToggleModal = useCallback(
        (item) => {
            setModalData(item);
            setShowExampleModal(!showExampleModal);
        },
        [showExampleModal]
    );

    const renderReadMore = useCallback(
        ({item}) => {
            return <ReadMore handleClick={handleToggleModal} item={item} />;
        },
        [handleToggleModal]
    );

    return (
        <div className={styles.applicationContainer}>
            <Container jumbotron>
                <section className={styles.application}>
                    <h5 className={styles.mainTitle}>
                        <Localize>NEAT+ APPLICATION</Localize>
                    </h5>
                    <div className={styles.infoWrapper}>
                        <div>
                            <h1 className={styles.subTitle}>
                                <Localize>
                                    Examples of the NEAT+ in action by humanitarian organizations
                                </Localize>
                            </h1>
                            <p className={styles.infoDesc}>
                                <Localize>
                                    The NEAT+ has been successfully used and applied in multiple field operations worldwide. The Rural NEAT+ is also available for use in French-, Spanish- and Arab-speaking operations.
                                </Localize>
                            </p>
                            <p className={styles.infoDesc}>
                                <Localize
                                    text="See examples and findings of previous NEAT+ pilots and environmental scoping missions. If you have a report to submit, please contact the UNEP/OCHA Joint Environment Unit (JEU) ({{ link:ochaunep@un.org }})."
                                    link={<a className={styles.descLink} href="mailto:ochaunep@un.org" />}
                                />
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
            </Container>
        </div>
    );
};

export default ExampleSection;

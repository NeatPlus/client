import {useCallback, useState} from 'react';

import {BsArrowRight} from 'react-icons/bs';
import CountryWorkModal from '../CountryWorkModal';

import styles from './styles.scss';

const CountryWorkCard = ({
    title,
    organizationName,
    description,
    modalTitle,
    modalImage,
    modalDescription,
    Ref,
}) => {
    const [showCountryWorkModal, setShowCountryWorkModal] = useState(false);

    const handleShowCountryWorkModal = useCallback(
        () => setShowCountryWorkModal(true),
        []
    );
    const handleHideCountryWorkModal = useCallback(
        () => setShowCountryWorkModal(false),
        []
    );
    return (
        <>
            <div className={styles.container} ref={Ref}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <BsArrowRight
                        size={20}
                        className={styles.arrowIcon}
                        onClick={handleShowCountryWorkModal}
                    />
                </div>
                <div className={styles.organization}>
                    <p className={styles.organizationTitle}>ORGANIZATION</p>
                    <p className={styles.organizationName}>
                        {organizationName}
                    </p>
                </div>
                <div className={styles.description}>
                    <p className={styles.descriptionTitle}>DESCRIPTION</p>
                    <p className={styles.descriptionText}>{description}</p>
                </div>
            </div>
            <CountryWorkModal
                isVisible={showCountryWorkModal}
                onClose={handleHideCountryWorkModal}
                title={modalTitle}
                image={modalImage}
                description={modalDescription}
            />
        </>
    );
};

export default CountryWorkCard;

import React, {useCallback} from 'react';
import {BsArrowRight} from 'react-icons/bs';

import {Localize} from '@ra/components/I18n';

import styles from './styles.scss';

const CountryWorkCard = ({item, toggleWorkModal}) => {
    const onClick = useCallback(() => {
        toggleWorkModal(item);
    }, [toggleWorkModal, item]);
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2
                    className={styles.title}
                    onClick={onClick}>
                    {item?.title}
                </h2>
                <BsArrowRight
                    size={20}
                    className={styles.arrowIcon}
                    onClick={toggleWorkModal}
                />
            </div>
            <div className={styles.organization}>
                <p className={styles.organizationTitle}><Localize>ORGANIZATION</Localize></p>
                <p className={styles.organizationName}>{item?.organization}</p>
            </div>
            <div className={styles.organization}>
                <p className={styles.organizationTitle}><Localize>MODULES TESTED</Localize></p>
                <p className={styles.organizationName}>{item?.contextTitle}</p>
            </div>
            <div className={styles.description}>
                <p className={styles.descriptionTitle}><Localize>DESCRIPTION</Localize></p>
                <p className={styles.descriptionText}>{item?.summary}</p>
            </div>
        </div>
    );
};

export default CountryWorkCard;

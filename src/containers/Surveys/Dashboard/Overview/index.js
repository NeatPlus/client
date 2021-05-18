import {IoIosArrowRoundForward} from 'react-icons/io';

import Button from 'components/Button';
import Map from 'components/Map';

import cs from '@ra/cs';

import styles from './styles.scss';

const InfoItem = ({title, value}) => {
    return (
        <>
            <p className={styles.infoTitle}>{title}</p>
            <p className={styles.infoValue}>{value}</p>
        </>
    );
};

const ConcernItem = ({value, type}) => {
    return (
        <div className={cs(styles.concernsItem, {
            [styles.concernsItemHigh]: type==='High',
            [styles.concernsItemMedium]: type==='Medium',
            [styles.concernsItemLow]: type==='Low',
        })}>
            <p className={styles.concernNumber}>{value}</p>
            <p className={styles.concernLabel}>{type} Concerns</p>
            <IoIosArrowRoundForward size={24} className={styles.concernIcon} />
        </div>
    );
};

const Overview = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Overview</h2>
            <div className={styles.overview}>
                <div className={styles.overviewContent}>
                    <p className={styles.description}>
                        Communities have social norms and values that affect their behaviours towards each other, and their interactions with the environment, on multiple levels. These interactions have environmental, social and economic implications. Vulnerable segments of society and the community are often disproportionately dependent and affected by the environment, and have unequal capacity for adaptation.
                    </p>
                    <div className={styles.surveyInformation}>
                        <h4 className={styles.infoHeader}>Survey Information</h4>
                        <div className={styles.infoContent}>
                            <InfoItem title="Name" value="Survey 1" />
                            <InfoItem title="Location" value="Wakanda" />
                            <InfoItem title="Organization" value="Avengers" />
                            <InfoItem title="Surveyed by" value="King T'Chala" />
                            <InfoItem title="Programme Scale" value="Country" />
                            <InfoItem title="Created on" value="15/04/2021" />
                            <InfoItem title="Modified on" value="15/04/2021" />
                        </div>
                        <Button secondary outline className={styles.buttonBottom}>
                            <span className={styles.buttonText}>
                                See Questionnaires
                            </span>
                        </Button>
                    </div>
                </div>
                <div className={styles.statementSummary}>
                    <h4 className={styles.statementTitle}>Statement Severity Summary</h4>
                    <div className={styles.concerns}>
                        <ConcernItem value={43} type="High" />
                        <ConcernItem value={32} type="Medium" />
                        <ConcernItem value={13} type="Low" />
                    </div>
                    <h4 className={styles.statementTitle}>Location of Assessment</h4>
                    <div className={styles.map}>
                        <Map />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;

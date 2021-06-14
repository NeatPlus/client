import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {IoIosArrowRoundForward} from 'react-icons/io';

import Button from 'components/Button';
import Map from 'components/Map';

import cs from '@ra/cs';

import styles from './styles.scss';

const getLocaleDate = (dateStr) => {
    const date = new Date(dateStr);
    if(!dateStr || !date) {
        return '';
    }
    return date.toLocaleDateString();
};

const InfoItem = ({title, value}) => {
    return (
        <>
            <p className={styles.infoTitle}>{title}</p>
            <p className={styles.infoValue}>{value || '-'}</p>
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
    const {activeSurvey} = useSelector(state => state.survey);

    const getSurveyAnswerFromCode = useCallback(code => {
        const answer = activeSurvey?.answers?.find(ans => ans.question.code === code)?.answer;
        if(answer) {
            return answer;
        }
        return '';
    }, [activeSurvey]);

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
                            <InfoItem 
                                title="Name" 
                                value={getSurveyAnswerFromCode('nickname')} 
                            />
                            <InfoItem 
                                title="Location" 
                                value={getSurveyAnswerFromCode('place')} 
                            />
                            <InfoItem 
                                title="Organization" 
                                value={getSurveyAnswerFromCode('org')} 
                            />
                            <InfoItem 
                                title="Surveyed by" 
                                value={getSurveyAnswerFromCode('usrname')}
                            />
                            <InfoItem 
                                title="Programme Scale" 
                                value={getSurveyAnswerFromCode('scale')} 
                            />
                            <InfoItem 
                                title="Created on" 
                                value={getLocaleDate(activeSurvey?.createdAt)} 
                            />
                            <InfoItem 
                                title="Modified on" 
                                value={getLocaleDate(activeSurvey?.modifiedAt)}
                            />
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
                        <Map surveyLocation={getSurveyAnswerFromCode('coords')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;

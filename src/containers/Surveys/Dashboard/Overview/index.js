import {useCallback, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {IoIosArrowRoundForward} from 'react-icons/io';

import Button from 'components/Button';
import Map from 'components/Map';
import SummaryModal from 'components/SummaryModal';
import TakeSurveyModal from 'components/TakeSurveyModal';
import List from '@ra/components/List';

import cs from '@ra/cs';
import * as questionActions from 'store/actions/question';
import {getSeverityCounts} from 'utils/severity';

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

const ConcernItem = ({item, onClick}) => {
    const handleClick = useCallback(() => {
        onClick && onClick(item.severity);
    }, [item, onClick]);

    return (
        <div 
            className={cs(styles.concernsItem, {
                [styles.concernsItemHigh]: item.severity==='High',
                [styles.concernsItemMedium]: item.severity==='Medium',
                [styles.concernsItemLow]: item.severity==='Low',
            })}
            onClick={handleClick}
        >
            <p className={styles.concernNumber}>{item.count}</p>
            <p className={styles.concernLabel}>{item.severity} Concerns</p>
            <IoIosArrowRoundForward size={24} className={styles.concernIcon} />
        </div>
    );
};

const Overview = () => {
    const dispatch = useDispatch();

    const {activeSurvey} = useSelector(state => state.survey);

    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [activeSeverity, setActiveSeverity] = useState('high');

    const handleShowQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers(activeSurvey?.answers));
        setShowQuestionnaire(true);
    }, [activeSurvey, dispatch]);

    const handleCloseQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowQuestionnaire(false);
    }, [dispatch]);

    const handleShowSummary = useCallback(severity => {
        setActiveSeverity(severity);
        setShowSummaryModal(true);
    }, []);
    const handleCloseSummaryModal = useCallback(() => {
        setShowSummaryModal(false);
    }, []);

    const getSurveyAnswerFromCode = useCallback(code => {
        const answer = activeSurvey?.answers?.find(ans => ans.question.code === code)?.answer;
        if(answer) {
            return answer;
        }
        return '';
    }, [activeSurvey]);

    const severityCounts = useMemo(() => getSeverityCounts(activeSurvey?.results || []), [activeSurvey]);

    const renderConcernItem = useCallback(listProps => (
        <ConcernItem {...listProps} onClick={handleShowSummary} />
    ), [handleShowSummary]);

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
                        <Button
                            disabled={!activeSurvey?.answers?.length}
                            onClick={handleShowQuestionnaire}
                            secondary 
                            outline 
                            className={styles.buttonBottom}
                        >
                            <span className={styles.buttonText}>
                                See Questionnaires
                            </span>
                        </Button>
                    </div>
                </div>
                <div className={styles.statementSummary}>
                    <h4 className={styles.statementTitle}>Statement Severity Summary</h4>
                    <List 
                        className={styles.concerns}
                        data={severityCounts}
                        keyExtractor={item => item.severity}
                        renderItem={renderConcernItem}
                    />
                    <h4 className={styles.statementTitle}>Location of Assessment</h4>
                    <div className={styles.map}>
                        <Map surveyLocation={getSurveyAnswerFromCode('coords')} />
                    </div>
                </div>
            </div>
            <TakeSurveyModal 
                isVisible={showQuestionnaire} 
                editable={false}
                onClose={handleCloseQuestionnaire}
            />
            <SummaryModal 
                isVisible={showSummaryModal} 
                onClose={handleCloseSummaryModal}
                activeSeverity={activeSeverity}
                setActiveSeverity={setActiveSeverity}
            />
        </div>
    );
};

export default Overview;

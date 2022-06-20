import {useCallback, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {IoIosArrowRoundForward} from 'react-icons/io';

import Map from 'components/Map';
import SummaryModal from 'components/SummaryModal';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
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
            <p className={styles.concernLabel}>{item.severity} <Localize>Concerns</Localize></p>
            <IoIosArrowRoundForward size={24} className={styles.concernIcon} />
        </div>
    );
};

const Overview = () => {
    const {modules} = useSelector(state => state.context);
    const {activeSurvey} = useSelector(state => state.survey);
    const {activeProject} = useSelector(state => state.project);

    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [activeSeverity, setActiveSeverity] = useState('high');

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

    const severityCounts = useMemo(() => {
        const sensitivityModule = modules.find(mod => mod.code === 'sens');
        return getSeverityCounts(activeSurvey?.results?.filter(res => {
            return res && res.module === sensitivityModule?.id;
        }) || []);
    }, [activeSurvey, modules]);

    const renderConcernItem = useCallback(listProps => (
        <ConcernItem {...listProps} onClick={handleShowSummary} />
    ), [handleShowSummary]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Overview</h2>
            <div className={styles.overview}>
                <div className={styles.overviewContent}>
                    <p className={styles.description}>
                        {getSurveyAnswerFromCode('overview')}
                    </p>
                    <div className={styles.surveyInformation}>
                        <h4 className={styles.infoHeader}><Localize>Survey Information</Localize></h4>
                        <div className={styles.infoContent}>
                            <InfoItem 
                                title={_('Name')}
                                value={getSurveyAnswerFromCode('nickname')} 
                            />
                            <InfoItem 
                                title={_('Location')}
                                value={getSurveyAnswerFromCode('place')} 
                            />
                            <InfoItem 
                                title={_('Organization')}
                                value={activeProject?.organizationTitle} 
                            />
                            <InfoItem 
                                title={_('Surveyed by')}
                                value={getSurveyAnswerFromCode('usrname')}
                            />
                            <InfoItem 
                                title={_('Programme Scale')}
                                value={getSurveyAnswerFromCode('scale')} 
                            />
                            <InfoItem 
                                title={_('Created on')}
                                value={getLocaleDate(activeSurvey?.createdAt)} 
                            />
                            <InfoItem 
                                title={_('Modified on')}
                                value={getLocaleDate(activeSurvey?.modifiedAt)}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.statementSummary}>
                    <h4 className={styles.statementTitle}>
                        <Localize>Sensitivity Statements Severity Summary</Localize>
                    </h4>
                    <List 
                        className={styles.concerns}
                        data={severityCounts}
                        keyExtractor={item => item.severity}
                        renderItem={renderConcernItem}
                    />
                    <h4 className={styles.statementTitle}><Localize>Location of Assessment</Localize></h4>
                    <div className={styles.map}>
                        <Map
                            surveyLocation={getSurveyAnswerFromCode('coords')}
                            height={275}
                        />
                    </div>
                </div>
            </div>
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

import React, {useCallback, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FiUpload, FiChevronRight} from 'react-icons/fi';
import {RiFileList3Line} from 'react-icons/ri';

import TakeSurveyModal from 'components/TakeSurveyModal';
import StatementAccordion from 'components/StatementAccordion';
import ConcernCounter from 'components/Concerns/Chart/counter';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import {sleep} from '@ra/utils';
import {getSeverityCounts} from 'utils/severity';
import * as questionActions from 'store/actions/question';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const ConcernItem = (props) => {
    const {item, total} = props;
    return (
        <div className={styles.concernsItem}>
            <ConcernCounter dataItem={item} totalCount={total} />
            <div className={styles.concernInfo}>
                <p className={styles.concernNumber}>{item.count}</p>
                <p className={styles.concernLabel}>{item.severity} <Localize>Concerns</Localize></p>
            </div>
        </div>
    );
};

const StatementsContent = ({
    statementData,
    index,
    topic,
    toggleExpand,
    expanded,
    moduleCode,
}) => {
    const dispatch = useDispatch();
    const {activeSurvey} = useSelector(state => state.survey);
    
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);

    const severityCounts = useMemo(() => getSeverityCounts(statementData), [statementData]);

    const handleShowQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers(activeSurvey?.answers));
        setShowQuestionnaire(true);
    }, [activeSurvey, dispatch]);

    const handleCloseQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowQuestionnaire(false);
    }, [dispatch]);

    const renderConcernItem = useCallback(listProps => {
        const total = severityCounts.reduce((acc, cur) => acc + cur.count, 0);
        return (
            <ConcernItem {...listProps} total={total} />
        );
    }, [severityCounts]);

    const renderStatementAccordion = useCallback(listProps => {
        return (
            <StatementAccordion 
                {...listProps} 
                isExpanded={expanded} 
            />
        );
    }, [expanded]);

    const handleExportPDF = useCallback(async () => {
        if(!expanded) {
            toggleExpand();
        }
        await sleep(expanded ? 200 : 1000); //Allow all remaining renders to complete
        window.print();
    }, [toggleExpand, expanded]);

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.title}>{topic.title}</h3>
                {index === 0 && (
                    <div className={styles.headerButtons}>
                        <TakeSurveyModal 
                            isVisible={showQuestionnaire} 
                            editable={false}
                            onClose={handleCloseQuestionnaire}
                            code={moduleCode}
                        />
                        <div
                            disabled={!activeSurvey?.answers?.length}
                            onClick={handleShowQuestionnaire}
                            className={styles.exports}
                        >
                            <RiFileList3Line />
                            <span className={styles.exportsTitle}><Localize>Show Questionnaires</Localize></span>
                        </div>
                        <div onClick={handleExportPDF} className={cs(styles.exports, 'no-print')}>
                            <FiUpload />
                            <span className={styles.exportsTitle}><Localize>Export PDF</Localize></span>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.infoWrapper}>
                <p className={styles.infoDesc}>
                    {topic.description}
                </p>
                <List
                    data={severityCounts}
                    className={styles.concerns}
                    keyExtractor={item => item.severity}
                    renderItem={renderConcernItem}
                />
            </div>
            <div className={styles.statementWrapper}>
                <div className={styles.statementHeader}>
                    <h4 className={styles.statementTitle}><Localize>Statements</Localize></h4>
                    {index === 0 && (
                        <div onClick={toggleExpand} className={cs(styles.expandWrapper, 'no-print')}>
                            <span>{expanded ? _('Collapse All') : _('Expand All')}</span>
                            <FiChevronRight />
                        </div>
                    )}
                </div>
                <List
                    data={statementData}
                    renderItem={renderStatementAccordion}
                    keyExtractor={keyExtractor}
                />
            </div>
        </section>
    );
};

export default StatementsContent;

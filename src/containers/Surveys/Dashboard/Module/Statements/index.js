import React, {useCallback, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {FiUpload, FiChevronRight} from 'react-icons/fi';

import StatementAccordion from 'components/StatementAccordion';
import ConcernCounter from 'components/Concerns/Chart/counter';

import List from '@ra/components/List';

import useFilterRemovedItems from 'hooks/useFilterRemovedItems';
import {getSeverityCounts} from 'utils/severity';
import {selectStatements} from 'store/selectors/statement';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const ConcernItem = (props) => {
    const {item, total} = props;
    return (
        <div className={styles.concernsItem}>
            <ConcernCounter dataItem={item} totalCount={total} />
            <p className={styles.concernNumber}>{item.count}</p>
            <p className={styles.concernLabel}>{item.severity} Concerns</p>
        </div>
    );
};

const StatementsContent = ({topic, index}) => {
    const statements = useSelector(selectStatements);
    const {activeSurvey} = useSelector(state => state.survey);

    const [expanded, setExpanded] = useState(false);

    const toggleExpand = useCallback(() => setExpanded(!expanded), [expanded]);

    const filteredStatements = useFilterRemovedItems(statements, 'statement');

    const statementData = useMemo(() => {
        const topicResults = activeSurvey?.results.filter(res => res.topic === topic.id);
        return topicResults?.map(res => ({
            ...res,
            statement: filteredStatements.find(st => st.id === res.statement),
        })).sort((a, b) => b.score - a.score)
            .filter(el => el.statement) || [];
    }, [activeSurvey, filteredStatements, topic]);

    const severityCounts = useMemo(() => getSeverityCounts(statementData), [statementData]);

    const renderConcernItem = useCallback(listProps => {
        return (
            <ConcernItem {...listProps} total={statementData.length} />
        );
    }, [statementData]);

    const renderStatementAccordion = useCallback(listProps => {
        return (
            <StatementAccordion 
                {...listProps} 
                isExpanded={expanded} 
            />
        );
    }, [expanded]);

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.title}>{topic.title}</h3>
                {index === 0 && (
                    <div className={styles.exports}>
                        <FiUpload />
                        <span className={styles.exportsTitle}>Export PDF</span>
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
                    <h4 className={styles.statementTitle}>statements</h4>
                    <div onClick={toggleExpand} className={styles.expandWrapper}>
                        <span>{expanded ? 'Collapse' : 'Expand'} All</span>
                        <FiChevronRight />
                    </div>
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

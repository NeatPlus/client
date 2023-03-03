import React, {useCallback, useMemo} from 'react';
import {FiChevronRight} from 'react-icons/fi';

import ReportSizeTabs from 'components/SurveyModuleReport/ReportSizeTabs';
import ExportPDFButton from 'components/SurveyModuleReport/HeaderControlButtons/ExportPDFButton';
import ShowQuestionnairesButton from 'components/SurveyModuleReport/HeaderControlButtons/ShowQuestionnairesButton';
import ReportOptionsDropdown from 'components/SurveyModuleReport//ReportOptionsDropdown';
import StatementAccordion from 'components/StatementAccordion';
import ConcernCounter from 'components/Concerns/Chart/counter';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import {sleep} from '@ra/utils';
import {getSeverityCounts} from 'utils/severity';

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
    publicMode,
    isCompact,
    onChangeCompactTab,
}) => {
    const severityCounts = useMemo(() => getSeverityCounts(statementData, isCompact), [statementData, isCompact]);

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
                module={moduleCode}
                isExpanded={expanded} 
            />
        );
    }, [expanded, moduleCode]);

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
                    <div className={cs(styles.headerButtons, 'no-print')}>
                        <ReportSizeTabs
                            isCompact={isCompact}
                            onChangeCompactTab={onChangeCompactTab}
                        />
                        <ShowQuestionnairesButton moduleCode={moduleCode} />
                        <ExportPDFButton onClick={handleExportPDF} />
                        {!publicMode && (
                            <ReportOptionsDropdown moduleCode={moduleCode} />
                        )}
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

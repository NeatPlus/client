import React, {useCallback, useMemo} from 'react';
import {FiAlertCircle} from 'react-icons/fi';

import InfoTooltip from 'components/InfoTooltip';

import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import {sleep} from '@ra/utils';
import {_} from 'services/i18n';

import ExportPDFButton from '../HeaderControlButtons/ExportPDFButton';
import ShowQuestionnairesButton from '../HeaderControlButtons/ShowQuestionnairesButton';
import ReportOptionsDropdown from '../ReportOptionsDropdown';
import ReportSizeTabs from '../ReportSizeTabs';

import styles from './styles.scss';

const idExtractor = item => item.id;

const StatementItem = ({item}) => {
    return (
        <div className={styles.statementItem}>
            {item.statement?.title || ''}
        </div>
    );
};

const SensitivityStatementItem = ({item}) => {
    const renderListData = useCallback(({item}) => (
        <li className={styles.listItem}>{item.title}</li>
    ), []);

    const highestPriorityMitigations = useMemo(() => {
        return (item.statement?.mitigations || []).filter(mitigation => {
            return mitigation.rank && mitigation.rank <= 2; 
        });
    }, [item]);

    const highestPriorityOpportunities = useMemo(() => {
        return (item.statement?.opportunities || []).filter(opportunity => {
            return opportunity.rank && opportunity.rank <= 2;
        });
    }, [item]);

    return (
        <div className={styles.statementItem}>
            <div className={styles.statementHeader}>
                {item.statement?.isExperimental && (
                    <InfoTooltip
                        icon={FiAlertCircle}
                        iconClassName={styles.experimentalIcon}
                        message={_('This concern level of this statement might vary by context.')}
                    />
                )}
                <h5 className={styles.statementTitle}>
                    {item.statement?.title || ''}
                </h5>
            </div>
            <div className={styles.statementDataListContainer}>
                <h6 className={styles.statementDataListTitle}>
                    <Localize>Highest priority mitigations</Localize>
                </h6>
                <List
                    data={highestPriorityMitigations}
                    component="ul"
                    keyExtractor={idExtractor}
                    renderItem={renderListData}
                    EmptyComponent={
                        <span className={styles.listInfo}>
                            <Localize>No mitigations of high priority found!</Localize>
                        </span>
                    }
                />
            </div>
            <div className={styles.statementDataListContainer}>
                <h6 className={styles.statementDataListTitle}>
                    <Localize>Highest priority opportunities</Localize>
                </h6>
                <List
                    data={highestPriorityOpportunities}
                    component="ul"
                    keyExtractor={idExtractor}
                    renderItem={renderListData}
                    EmptyComponent={
                        <span className={styles.listInfo}>
                            <Localize>No opportunities of high priority found!</Localize>
                        </span>
                    }
                />
            </div>
        </div>
    );
};

const CompactReport = ({
    statements,
    moduleCode,
    isCompact,
    onChangeCompactTab,
    publicMode
}) => {
    const handleExportPDF = useCallback(async () => {
        await sleep(200); //Allow all remaining renders to complete
        window.print();
    }, []);

    const renderListData = useCallback(({item}) =>
        <li className={styles.cardListItem}>{item.title}</li>,
    []);

    return (
        <div className={styles.container}>
            <p className={styles.introText}>
                <span>
                    <Localize>
                        The following is short report summarising only the highest priority sensitivities, mitigations and opportunities identified in response to your U-NEAT assessment answers.
                    </Localize>
                </span> <span className="no-print">
                    <Localize>
                        To see a longer report containing medium and high priority sensitivities, mitigations and opportunities, that are still important, please click on the “Full” button.
                    </Localize>
                </span>
            </p>
            <div className={styles.statementsSection}>
                <div className={styles.statementsHeader}>
                    <h2 className={styles.statementsTitle}>
                        <Localize>Statements</Localize>
                    </h2>
                    <div className={cs(styles.reportControls, 'no-print')}>
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
                </div>
                <List
                    className={cs({
                        [styles.statementsListActivity]: moduleCode !== 'sens',
                        [styles.statementsListSensitivity]: moduleCode === 'sens'
                    })}
                    data={statements}
                    renderItem={moduleCode === 'sens' ? SensitivityStatementItem : StatementItem}
                    keyExtractor={idExtractor}
                />
            </div>
            {moduleCode !== 'sens' && (
                <div className={styles.mitigationsSection}>
                    <div className={styles.mitigationsCardContainer}>
                        <h2 className={styles.mitigationsSectionTitle}>
                            <Localize>Highest Ranked Mitigations and Opportunities</Localize>
                        </h2>
                        <p className={styles.mitigationsDescription}>
                            <Localize>
                                The following are the highest ranked mitigations addressing the most significant Sensitivities identified in response to your U-NEAT+ assessment questions. Mitigations all relate to actions that can be undertaken by humanitarian responders. Most of these can be enacted in the field, whilst some should be referred to your regional or head office for action. Opportunities are all actions that you can put in place to support or enable development actions undertaken by others. You should view the full report for a longer list of mitigations and opportunities to review in order to select those most relevant to your activities.
                            </Localize>
                        </p>
                        <div className={styles.mitigationsCard}>
                            <div className={styles.cardBodySection}>
                                <h5 className={styles.cardBodySectionTitle}>
                                    <Localize>Highest priority humanitarian mitigations</Localize>
                                </h5>
                                <List
                                    data={[]} // TODO: Get important mitigations
                                    component="ul"
                                    keyExtractor={idExtractor}
                                    renderItem={renderListData}
                                    EmptyComponent={
                                        <span className={styles.listInfo}>
                                            <Localize>This feature is currently under development. Please check back later!</Localize>
                                            {/*TODO: After development <Localize>No mitigations data found!</Localize>*/}
                                        </span>
                                    }
                                />
                            </div>
                            <div className={styles.cardBodySection}>
                                <h5 className={styles.cardBodySectionTitle}>
                                    <Localize>Highest priority potential development opportunities</Localize>
                                </h5>
                                <List
                                    data={[]} // TODO: Get important opportunities
                                    component="ul"
                                    keyExtractor={idExtractor}
                                    renderItem={renderListData}
                                    EmptyComponent={
                                        <span className={styles.listInfo}>
                                            <Localize>This feature is currently under development. Please check back later!</Localize>
                                            {/*TODO: After development <Localize>No opportunities data found!</Localize>*/}
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.mitigationsCardContainer}>
                        <h2 className={styles.mitigationsSectionTitle}>
                            <Localize>Recurring Mitigations and Opportunities</Localize>
                        </h2>
                        <p className={styles.mitigationsDescription}>
                            <Localize>
                                The following mitigations are not the highest priority, but they have been identified multiple times in response to your assessment answers. Please consider whether you can implement some of them in your response.
                            </Localize>
                        </p>
                        <div className={styles.mitigationsCard}>
                            <div className={styles.cardBodySection}>
                                <h5 className={styles.cardBodySectionTitle}>
                                    <Localize>HUMANITARIAN MITIGATIONS</Localize>
                                </h5>
                                <List
                                    data={[]} // TODO: Get recurring mitigations
                                    component="ul"
                                    keyExtractor={idExtractor}
                                    renderItem={renderListData}
                                    EmptyComponent={
                                        <span className={styles.listInfo}>
                                            <Localize>This feature is currently under development. Please check back later!</Localize>
                                            {/*TODO: After development <Localize>No mitigations data found!</Localize>*/}
                                        </span>
                                    }
                                />
                            </div>
                            <div className={styles.cardBodySection}>
                                <h5 className={styles.cardBodySectionTitle}>
                                    <Localize>DEVELOPMENT OPPORTUNITIES</Localize>
                                </h5>
                                <List
                                    data={[]} // TODO: Get recurring opportunities
                                    component="ul"
                                    keyExtractor={idExtractor}
                                    renderItem={renderListData}
                                    EmptyComponent={
                                        <span className={styles.listInfo}>
                                            <Localize>This feature is currently under development. Please check back later!</Localize>
                                            {/*TODO: After development <Localize>No opportunities data found!</Localize>*/}
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompactReport;

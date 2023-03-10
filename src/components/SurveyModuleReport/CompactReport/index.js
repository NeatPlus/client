import React, {useCallback, useMemo, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {FiAlertCircle} from 'react-icons/fi';

import InfoTooltip from 'components/InfoTooltip';

import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import Api from 'services/api';
import cs from '@ra/cs';
import {sleep} from '@ra/utils';
import {_} from 'services/i18n';
import {COMPACT_SENSITIVITY_MITIGATIONS_RANK_THRESHOLD_LTEQ} from 'utils/config';

import usePromise from '@ra/hooks/usePromise';

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
            return mitigation.rank && mitigation.rank <= COMPACT_SENSITIVITY_MITIGATIONS_RANK_THRESHOLD_LTEQ; 
        });
    }, [item]);

    const highestPriorityOpportunities = useMemo(() => {
        return (item.statement?.opportunities || []).filter(opportunity => {
            return opportunity.rank && opportunity.rank <= COMPACT_SENSITIVITY_MITIGATIONS_RANK_THRESHOLD_LTEQ;
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

const MitigationsOpportunitiesCard = ({
    mitigationsData,
    opportunitiesData,
    loading,
    mitigationsTitle,
    opportunitiesTitle,
    mitigationsEmptyComponent,
    opportunitiesEmptyComponent
}) => {
    const renderListData = useCallback(({item}) =>
        <li className={styles.cardListItem}>{item}</li>,
    []);

    return (
        <div className={styles.mitigationsCard}>
            <div className={styles.cardBodySection}>
                <h5 className={styles.cardBodySectionTitle}>
                    {mitigationsTitle}
                </h5>
                <List
                    loading={loading}
                    data={mitigationsData || []}
                    component="ul"
                    keyExtractor={idExtractor}
                    renderItem={renderListData}
                    EmptyComponent={mitigationsEmptyComponent}
                    LoadingComponent={
                        <span className={styles.listInfo}>
                            <Localize>Loading...</Localize>
                        </span>
                    }
                />
            </div>
            <div className={styles.cardBodySection}>
                <h5 className={styles.cardBodySectionTitle}>
                    {opportunitiesTitle}
                </h5>
                <List
                    loading={loading}
                    data={opportunitiesData || []}
                    component="ul"
                    keyExtractor={idExtractor}
                    renderItem={renderListData}
                    EmptyComponent={opportunitiesEmptyComponent}
                    LoadingComponent={
                        <span className={styles.listInfo}>
                            <Localize>Loading...</Localize>
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
    const {activeSurvey} = useSelector(state => state.survey);
    const {modules} = useSelector(state => state.context);

    const activeModule = useMemo(() => modules.find(mod => {
        return mod.code === moduleCode;
    }), [modules, moduleCode]);

    const [{loading: loadingInsights, result: insights}, getMitigationsOpportunitiesInsight] = usePromise(Api.getMitigationsOpportunitiesInsight);

    useEffect(() => {
        if(activeSurvey?.id && activeModule?.id && activeModule?.code !== 'sens') {
            getMitigationsOpportunitiesInsight({survey: activeSurvey.id, module: activeModule.id});
        }
    }, [activeSurvey, activeModule, getMitigationsOpportunitiesInsight]);

    const handleExportPDF = useCallback(async () => {
        await sleep(200); //Allow all remaining renders to complete
        window.print();
    }, []);

    return (
        <div className={styles.container}>
            <p className={styles.introText}>
                <span>
                    <Localize>
                        The following report summarises only the highest priority sensitivities, mitigations and opportunities identified in response to your U-NEAT assessment answers.
                    </Localize>
                </span> <span className="no-print">
                    <Localize>
                        To see a longer report including all high, medium and low priority sensitivities, mitigations and opportunities, please click on the “Detailed” report button.
                    </Localize>
                </span>
            </p>
            <div className={styles.statementsSection}>
                <div className={styles.statementsHeader}>
                    <div className={styles.statementsHeaderContent}>
                        <h2 className={styles.statementsHeading}>
                            <Localize>Highest priority sensitivity statements, mitigations and opportunities</Localize>
                        </h2>
                        {moduleCode !== 'sens' && (
                            <h2 className={styles.statementsTitle}>
                                <Localize>Sensitivity statements</Localize>
                            </h2>
                        )}
                    </div>
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
                        <MitigationsOpportunitiesCard
                            loading={loadingInsights}
                            mitigationsData={insights?.mitigations?.important || []}
                            opportunitiesData={insights?.opportunities?.important || []}
                            mitigationsTitle={_('Highest priority humanitarian mitigations')}
                            opportunitiesTitle={_('Highest priority potential development opportunities')}
                            mitigationsEmptyComponent={
                                <span className={styles.listInfo}>
                                    <Localize>No mitigations data found!</Localize>
                                </span>
                            }
                            opportunitiesEmptyComponent={
                                <span className={styles.listInfo}>
                                    <Localize>No opportunities data found!</Localize>
                                </span>
                            }
                        />
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
                        <MitigationsOpportunitiesCard
                            loading={loadingInsights}
                            mitigationsData={insights?.mitigations?.repeated || []}
                            opportunitiesData={insights?.opportunities?.repeated || []}
                            mitigationsTitle={_('HUMANITARIAN MITIGATIONS')}
                            opportunitiesTitle={_('DEVELOPMENT OPPORTUNITIES')}
                            mitigationsEmptyComponent={
                                <span className={styles.listInfo}>
                                    <Localize>No mitigations data found!</Localize>
                                </span>
                            }
                            opportunitiesEmptyComponent={
                                <span className={styles.listInfo}>
                                    <Localize>No opportunities data found!</Localize>
                                </span>
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompactReport;

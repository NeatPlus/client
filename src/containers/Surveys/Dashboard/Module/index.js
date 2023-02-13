import {useCallback, useEffect, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import SVG from 'react-inlinesvg';
import {BsPlus} from 'react-icons/bs';
import {FiAlertCircle} from 'react-icons/fi';

import TakeSurveyModal from 'components/TakeSurveyModal';
import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import Editable from 'components/Editable';
import SurveyModals from 'components/SurveyModals';
import Tabs, {Tab} from '@ra/components/Tabs';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import useFilterItems from 'hooks/useFilterItems';
import useSurveyModals from 'hooks/useSurveyModals';
import {selectStatements} from 'store/selectors/statement';
import {AVAILABLE_SURVEY_MODULES} from 'utils/config';
import {THRESHOLDS} from 'utils/severity';

import * as questionActions from 'store/actions/question';

import fillImage from 'assets/images/fill-questionnaire.svg';
import devImage from 'assets/images/under-development.svg';
import topicIconPlaceholder from 'assets/icons/topic-icon-placeholder.svg';

import StatementsContent from './Statements';
import styles from './styles.scss';

const FillQuestionnaire = props => {
    const {activeSurvey, moduleCode, hasResults} = props;

    const dispatch = useDispatch();
    const {activeProject} = useSelector(state => state.project);
    const {questions} = useSelector(state => state.question);

    const [showQuestionnaire, setShowQuestionnaire] = useState(false);

    const handleShowQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers(activeSurvey?.answers.map(ans => (
            {...ans, question: ans.question.id}
        )).filter(ans => questions?.[moduleCode]?.some(ques => ques.id === ans.question))));
        setShowQuestionnaire(true);
    }, [activeSurvey, dispatch, questions, moduleCode]);

    const handleCloseQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowQuestionnaire(false);
    }, [dispatch]);

    const surveyModalsConfig = useSurveyModals(moduleCode, activeSurvey?.id);

    return (
        <div className={styles.container}>
            <img className={styles.infoImage} src={fillImage} alt={_('Fill Questionnaire')} />
            <p className={styles.infoText}>
                {hasResults ? (
                    <Localize>The questionnaire filled for this module did not result in any severity concerns.</Localize>
                ) : (
                    <Localize>Please fill up the questionnaire to view this analysis.</Localize>
                )}
            </p>
            <Button 
                outline 
                onClick={hasResults ? handleShowQuestionnaire : surveyModalsConfig.handleShowDeleteDraft} 
                className={styles.button}
            >
                {!hasResults && <BsPlus className={styles.buttonIcon} />}
                <Localize>{hasResults ? _('View Questionnaire') : _('Take Survey')}</Localize>
            </Button>
            {hasResults ? (
                <TakeSurveyModal isVisible={showQuestionnaire} editable={false} onClose={handleCloseQuestionnaire} code={moduleCode} isNewEdit={activeProject?.isAdminOrOwner} />
            ) : (
                <SurveyModals {...surveyModalsConfig} />
            )}
        </div>
    );
};

const UnderDevelopment = props => {
    return (
        <div className={styles.container}>
            <img className={styles.infoImage} src={devImage} alt={_('Under Development')} />
            <p className={styles.infoText}>
                <Localize>This module is under development. Please check back later.</Localize>
            </p>
        </div>
    );
};

const Module = props => {
    const {code, publicMode} = props;

    const [expanded, setExpanded] = useState(false);
    
    const statements = useSelector(selectStatements);
    const {topics} = useSelector(state => state.statement);
    const {isEditMode} = useSelector(state => state.dashboard);
    const {activeSurvey} = useSelector(state => state.survey);
    const {modules} = useSelector(state => state.context);

    const toggleExpand = useCallback(() => setExpanded(!expanded), [expanded]);

    useEffect(() => {
        document.body.classList.add('mode-print');
        return () => {
            document.body.classList.remove('mode-print');
        };
    }, []);

    const renderTabsHeader = useCallback(tabHeaderProps => {
        const {title, active, ...rest} = tabHeaderProps;

        const iconSrc = tabHeaderProps.children?.props?.topic?.icon;

        return (
            <div className={cs(styles.headerItem, {
                [styles.headerItemActive]: active && !isEditMode,
            })} {...rest}>
                <Editable 
                    type="topic" 
                    accessor="code"
                    module={code}
                    identifier={tabHeaderProps.label}
                >
                    <div className={styles.headerTitle}>
                        <SVG 
                            className={styles.tabIcon}
                            src={iconSrc || topicIconPlaceholder}
                            width={20} 
                            title={title}
                        >
                            <SVG className={styles.tabIcon} width={20}  src={topicIconPlaceholder} title={title} />
                        </SVG>
                        <span className={styles.tabLabel}>{title}</span>
                    </div>
                </Editable>
            </div>
        );
    }, [isEditMode, code]);

    const selectedTopics = useFilterItems(topics, 'topic', code);
    const filteredStatements = useFilterItems(statements, 'statement', code);

    const activeModule = useMemo(() => modules.find(mod => mod.code === code), [code, modules]);
    const moduleResults = useMemo(() => activeSurvey?.results.filter(res => {
        return res.module === activeModule?.id;
    }) || [], [activeSurvey, activeModule]);

    const filteredTopics = useMemo(() => {
        return selectedTopics.filter(tpc => {
            return moduleResults.some(res => res.score >= THRESHOLDS.low && res.topic === tpc.id);
        });
    }, [selectedTopics, moduleResults]);

    const getStatementData = useCallback(topic => {
        const topicResults = moduleResults.filter(res => res.topic === topic.id);
        return topicResults?.map(res => ({
            ...res,
            statement: filteredStatements.find(st => st.id === res.statement),
        })).sort((a, b) => b.score - a.score)
            .filter(el => el.statement) || [];
    }, [moduleResults, filteredStatements]);

    const doModuleResultsExist = useMemo(() => {
        return Boolean(moduleResults.length);
    }, [moduleResults]);

    const renderTab = useCallback((topic, idx) => {
        const statementData = getStatementData(topic);
        const filteredStatementData = statementData.filter(stData => stData.score >= THRESHOLDS.low);

        if(!filteredStatementData.length) {
            return null;
        }

        return (
            <Tab
                key={topic.code}
                label={topic.code}
                title={topic.title}
                className={styles.tabContent}
            >
                <StatementsContent 
                    toggleExpand={toggleExpand}
                    expanded={expanded}
                    statementData={filteredStatementData}
                    topic={topic}
                    index={idx}
                    moduleCode={code}
                    publicMode={publicMode}
                />
            </Tab>
        );
    }, [getStatementData, toggleExpand, expanded, code, publicMode]);

    if(!topics?.length) {
        return <NeatLoader />;
    }
    if(!AVAILABLE_SURVEY_MODULES.includes(code)) {
        return <UnderDevelopment />;
    }  
    if(!doModuleResultsExist) {
        return <FillQuestionnaire activeSurvey={activeSurvey} moduleCode={code} />;
    }
    if(!moduleResults.some(res => res.score >= THRESHOLDS.low)) {
        return <FillQuestionnaire activeSurvey={activeSurvey} moduleCode={code} hasResults />;
    }

    return (
        <div className={styles.tabsContainer}>
            <Tabs
                className={styles.tabs}
                renderHeader={renderTabsHeader}
                headerClassName={cs(styles.tabsHeader, 'no-print')}
                contentContainerClassName={styles.contentContainer}
                defaultActiveTab={filteredTopics?.[0]?.code}
                mode="scroll"
            >
                {filteredTopics.map(renderTab)}
            </Tabs>
            <div className={styles.disclaimer}>
                * The concern levels of statements with <FiAlertCircle className={styles.infoIcon} /> might vary by context.
            </div>
        </div>
    );
};

export default Module;

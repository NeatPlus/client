import {useCallback, useEffect, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import SVG from 'react-inlinesvg';
import {BsPlus} from 'react-icons/bs';

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

import fillImage from 'assets/images/fill-questionnaire.svg';
import devImage from 'assets/images/under-development.svg';
import topicIconPlaceholder from 'assets/icons/topic-icon-placeholder.svg';

import StatementsContent from './Statements';
import styles from './styles.scss';

const FillQuestionnaire = props => {
    const {activeSurvey, moduleCode} = props;

    const surveyModalsConfig = useSurveyModals(moduleCode, activeSurvey?.id);

    return (
        <div className={styles.container}>
            <img className={styles.infoImage} src={fillImage} alt={_('Fill Questionnaire')} />
            <p className={styles.infoText}>
                <Localize>Please fill up the questionnaire to view this analysis.</Localize>
            </p>
            <Button 
                outline 
                onClick={surveyModalsConfig.handleShowDeleteDraft} 
                className={styles.button}
            >
                <BsPlus className={styles.buttonIcon} />
                <Localize>Take Survey</Localize>
            </Button>
            <SurveyModals {...surveyModalsConfig} />
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
                        />
                        <span className={styles.tabLabel}>{title}</span>
                    </div>
                </Editable>
            </div>
        );
    }, [isEditMode, code]);

    const filteredTopics = useFilterItems(topics, 'topic', code);
    const filteredStatements = useFilterItems(statements, 'statement', code);

    const activeModule = useMemo(() => modules.find(mod => mod.code === code), [code, modules]);


    const getStatementData = useCallback(topic => {
        const topicResults = activeSurvey?.results.filter(res => res.topic === topic.id && res.module === activeModule?.id);
        return topicResults?.map(res => ({
            ...res,
            statement: filteredStatements.find(st => st.id === res.statement),
        })).sort((a, b) => b.score - a.score)
            .filter(el => el.statement) || [];
    }, [activeSurvey, filteredStatements, activeModule]);

    const doModuleResultsExist = useMemo(() => {
        return activeSurvey?.results?.some(res => res.module === activeModule?.id);
    }, [activeSurvey, activeModule]);

    const renderTab = useCallback((topic, idx) => {
        const statementData = getStatementData(topic);

        if(!statementData.length) {
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
                    statementData={statementData}
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

    return (
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
    );
};

export default Module;

import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import SVG from 'react-inlinesvg';
import {BsPlus} from 'react-icons/bs';

import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import Editable from 'components/Editable';
import SurveyModals from 'components/SurveyModals';
import Tabs, {Tab} from '@ra/components/Tabs';

import cs from '@ra/cs';
import useFilterItems from 'hooks/useFilterItems';
import useSurveyModals from 'hooks/useSurveyModals';
import {selectStatements} from 'store/selectors/statement';

import fillImage from 'assets/images/fill-questionnaire.svg';
import devImage from 'assets/images/under-development.svg';
import topicIconPlaceholder from 'assets/icons/topic-icon-placeholder.svg';

import StatementsContent from './Statements';
import styles from './styles.scss';

const FillQuestionnaire = props => {
    const surveyModalsConfig = useSurveyModals('shelter');

    return (
        <div className={styles.container}>
            <img className={styles.infoImage} src={fillImage} alt="Fill Questionnaire" />
            <p className={styles.infoText}>
                Please fill up the Shelter questionnaire to view this analysis.
            </p>
            <Button 
                outline 
                onClick={surveyModalsConfig.handleShowDeleteDraft} 
                className={styles.button}
            >
                <BsPlus className={styles.buttonIcon} />
                Take Survey
            </Button>
            <SurveyModals {...surveyModalsConfig} />
        </div>
    );
};

const UnderDevelopment = props => {
    return (
        <div className={styles.container}>
            <img className={styles.infoImage} src={devImage} alt="Under Development" />
            <p className={styles.infoText}>
                This module is under development. Please check back later.
            </p>
        </div>
    );
};

const Module = props => {
    const {code} = props;
    
    const statements = useSelector(selectStatements);
    const {topics} = useSelector(state => state.statement);
    const {isEditMode} = useSelector(state => state.dashboard);
    const {activeSurvey} = useSelector(state => state.survey);

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
    }, [isEditMode]);

    const filteredTopics = useFilterItems(topics, 'topic');
    const filteredStatements = useFilterItems(statements, 'statement');

    const getStatementData = useCallback(topic => {
        const topicResults = activeSurvey?.results.filter(res => res.topic === topic.id);
        return topicResults?.map(res => ({
            ...res,
            statement: filteredStatements.find(st => st.id === res.statement),
        })).sort((a, b) => b.score - a.score)
            .filter(el => el.statement) || [];
    }, [activeSurvey, filteredStatements]);

    const renderTab = useCallback((topic, idx) => {
        const statementData = getStatementData(topic);

        if(!statementData.length) {
            return null;
        }

        return (
            <Tab key={topic.code} label={topic.code} title={topic.title} className={styles.tabContent}>
                <StatementsContent statementData={statementData} topic={topic} index={idx} />
            </Tab>
        );
    }, [getStatementData]);

    if(!topics?.length) {
        return <NeatLoader />;
    }
    if(code==='shelter') {
        return <FillQuestionnaire />;
    }
    if(code!=='sens') {
        return <UnderDevelopment />;
    }

    return (
        <Tabs
            className={styles.tabs}
            renderHeader={renderTabsHeader}
            headerClassName={styles.tabsHeader}
            contentContainerClassName={styles.contentContainer}
            defaultActiveTab={filteredTopics?.[0]?.code}
            mode="scroll"
        >
            {filteredTopics.map(renderTab)}
        </Tabs>
    );
};

export default Module;

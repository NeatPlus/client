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

import fillImage from 'assets/images/fill-questionnaire.svg';
import devImage from 'assets/images/under-development.svg';
import tabPlaceholder from 'assets/icons/tab-placeholder.svg';

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

    const {topics} = useSelector(state => state.statement);
    const {isEditMode} = useSelector(state => state.dashboard);

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
                            src={iconSrc || tabPlaceholder}
                            width={20} 
                            title={title}
                        />
                        {title}
                    </div>
                </Editable>
            </div>
        );
    }, [isEditMode]);

    const filteredTopics = useFilterItems(topics, 'topic');

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
            {filteredTopics.map((topic, idx) => (
                <Tab key={topic.code} label={topic.code} title={topic.title} className={styles.tabContent}>
                    <StatementsContent topic={topic} index={idx} />
                </Tab>
            ))}
        </Tabs>
    );
};

export default Module;

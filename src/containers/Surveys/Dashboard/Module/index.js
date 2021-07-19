import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import SVG from 'react-inlinesvg';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import Editable from 'components/Editable';
import TakeSurveyModal from 'components/TakeSurveyModal';
import Tabs, {Tab} from '@ra/components/Tabs';

import cs from '@ra/cs';
import useFilterItems from 'hooks/useFilterItems';

import fillImage from 'assets/images/fill-questionnaire.svg';

import StatementsContent from './Statements';
import styles from './styles.scss';

const ShelterStatements = props => {
    const [showSurveyModal, setShowSurveyModal] = useState(false);

    const handleShowSurveyModal = useCallback(() => {
        setShowSurveyModal(true);
    }, []);
    const hideSurveyModal = useCallback(() => {
        setShowSurveyModal(false);
    }, []);
    
    return (
        <div className={styles.container}>
            <img className={styles.fillImage} src={fillImage} alt="Fill Questionnaire" />
            <p className={styles.fillText}>
                Please fill up the Shelter questionnaire to view this analysis.
            </p>
            <Button 
                outline 
                disabled // TODO: Show survey modal for shelter module
                onClick={handleShowSurveyModal} 
                className={styles.button}
            >
                <BsPlus className={styles.buttonIcon} />
                Take Survey
            </Button>
            <TakeSurveyModal 
                isVisible={showSurveyModal} 
                onClose={hideSurveyModal} 
                moduleCode="shelter" 
            />
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
                        {!!iconSrc && (
                            <SVG 
                                className={styles.tabIcon}
                                src={iconSrc}
                                width={20} 
                                title={title}
                            />
                        )}
                        {title}
                    </div>
                </Editable>
            </div>
        );
    }, [isEditMode]);

    const filteredTopics = useFilterItems(topics, 'topic');

    if(code==='shelter') {
        return <ShelterStatements />;
    }

    if(!topics?.length || code!=='sens') {
        return null;
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

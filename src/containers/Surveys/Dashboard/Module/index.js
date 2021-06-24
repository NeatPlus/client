import {useCallback} from 'react';
import {useSelector} from 'react-redux';

import Editable from 'components/Editable';
import Tabs, {Tab} from '@ra/components/Tabs';

import cs from '@ra/cs';
import useFilterRemovedItems from 'hooks/useFilterRemovedItems';

import StatementsContent from './Statements';
import styles from './styles.scss';

const Module = props => {
    const {type} = props;

    const {topics} = useSelector(state => state.statement);
    const {isEditMode} = useSelector(state => state.dashboard);

    const renderTabsHeader = useCallback(tabHeaderProps => {
        const {title, active, ...rest} = tabHeaderProps;
        return (
            <div className={cs(styles.headerItem, {
                [styles.headerItemActive]: active && !isEditMode,
            })} {...rest}>
                <Editable 
                    type="topic" 
                    accessor="code" 
                    identifier={tabHeaderProps.label}
                >
                    {title}
                </Editable>
            </div>
        );
    }, [isEditMode]);

    const filteredTopics = useFilterRemovedItems(topics, 'topic');

    if(!topics?.length || type!=='sensitivity') {
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

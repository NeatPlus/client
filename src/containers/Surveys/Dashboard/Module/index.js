import {useCallback} from 'react';
import {useSelector} from 'react-redux';

import Tabs, {Tab} from '@ra/components/Tabs';
import cs from '@ra/cs';

import StatementsContent from './Statements';
import styles from './styles.scss';

const Module = props => {
    const {topics} = useSelector(state => state.statement);

    const renderTabsHeader = useCallback(tabHeaderProps => {
        const {title, active, ...rest} = tabHeaderProps;
        return (
            <div className={cs(styles.headerItem, {
                [styles.headerItemActive]: active,
            })} {...rest}>
                {title}
            </div>
        );
    }, []);

    if(!topics?.length) {
        return null;
    }

    return (
        <Tabs
            className={styles.tabs}
            renderHeader={renderTabsHeader}
            headerClassName={styles.tabsHeader}
            contentContainerClassName={styles.contentContainer}
            defaultActiveTab={topics?.[0]?.code}
        >
            {topics.map(topic => (
                <Tab key={topic.code} label={topic.code} title={topic.title} className={styles.tabContent}>
                    <StatementsContent topic={topic} />
                </Tab>
            ))}
        </Tabs>
    );
};

export default Module;

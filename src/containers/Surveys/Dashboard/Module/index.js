import {useCallback} from 'react';
import Tabs, {Tab} from '@ra/components/Tabs';

import cs from '@ra/cs';

import styles from './styles.scss';

const Module = props => {
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

    return (
        <Tabs
            className={styles.tabs}
            renderHeader={renderTabsHeader}
            headerClassName={styles.tabsHeader}
            contentContainerClassName={styles.contentContainer}
            defaultActiveTab="community"
        >
            <Tab label="community" title="Community Size and Capacity" className={styles.tabContent}>
                Community Size and Capacity 
            </Tab>
            <Tab label="social" title="Social Behavior and Cohesion" className={styles.tabContent}>
                Social Behavior and Cohesion
            </Tab>
            <Tab label="biodiversity" title="Biodiversity Sensitivity" className={styles.tabContent}>
                Biodiversity Sensitivity
            </Tab>
            <Tab label="air" title="Air Quality" className={styles.tabContent}>
                Air Quality
            </Tab>
            <Tab label="water" title="Water Resources" className={styles.tabContent}>
                Water Resources
            </Tab>
            <Tab label="environment" title="Environmental Sanitation" className={styles.tabContent}>
                Environmental Sanitation
            </Tab>
            <Tab label="hazard" title="Hazards" className={styles.tabContent}>
                Hazards
            </Tab>
        </Tabs>
    );
};

export default Module;

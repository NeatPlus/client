import {useCallback} from 'react';

import Tabs, {Tab} from 'components/Tabs';

import Overview from '../Overview';
import Module from '../Module';

import styles from './styles.scss';

const SurveyTabs = props => {
    const {activeTab, onTabChange, renderHeaderControls, publicMode} = props;

    const renderSpacer = useCallback(() => {
        if (activeTab==='overview' || publicMode) {
            return null;
        }
        return <div className={styles.spacer} />;
    }, [activeTab, publicMode]);

    return (
        <Tabs 
            activeTab={activeTab}
            secondary 
            className={styles.tabs}
            PreHeaderComponent={renderSpacer}
            PostHeaderComponent={renderHeaderControls}
            headerContainerClassName={styles.headerContainer}
            headerClassName={styles.tabsHeader}
            tabItemClassName={styles.headerItem}
            contentContainerClassName={styles.tabContent}
            onChange={onTabChange}
        >
            <Tab label="overview" title="Overview">
                <Overview />
            </Tab>
            <Tab label="sensitivity" title="Sensitivity">
                <Module code="sens" />
            </Tab>
            {/* FIXME: Other tab modules in public mode */}
            {!publicMode && (
                <Tab label="shelter" title="Shelter">
                    <Module code="shelter" />
                </Tab>
            )}
            {!publicMode && (
                <Tab label="wash" title="WASH">
                    <Module code="wash" />
                </Tab>
            )}
            {!publicMode && (
                <Tab label="fs" title="FS">
                    <Module code="fs" />
                </Tab>
            )}
        </Tabs>
    );
};

export default SurveyTabs;

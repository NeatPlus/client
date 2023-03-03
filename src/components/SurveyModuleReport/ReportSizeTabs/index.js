import React from 'react';

import Tabs, {Tab} from 'components/Tabs';

import {_} from 'services/i18n';

import styles from './styles.scss';

const ReportSizeTabs = ({
    isCompact,
    onChangeCompactTab,
}) => {
    return (
        <Tabs
            headerClassName={styles.tabHeader}
            tabItemClassName={styles.tabHeaderItem}
            activeTabItemClassName={styles.tabHeaderItemActive}
            activeTab={isCompact ? 'compact' : 'full'}
            onChange={onChangeCompactTab}
        >
            <Tab label="compact" title={_('Compact')} />
            <Tab label="full" title={_('Full')} />
        </Tabs>
    );
};

export default ReportSizeTabs;

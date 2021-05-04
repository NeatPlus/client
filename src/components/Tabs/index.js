import Tabs, {Tab} from '@ra/components/Tabs';
import cs from '@ra/cs';

import styles from './styles.scss';

export {Tab};

const _Tabs = props => {
    const {className, secondary=false, headerClassName, tabItemClassName, activeTabItemClassName, ...tabProps} = props;

    return (
        <div className={className}>
            <Tabs 
                headerClassName={cs(secondary ? styles.tabHeaderSecondary : styles.tabHeader, headerClassName)} 
                tabItemClassName={cs(secondary ? styles.tabHeaderSecondaryItem : styles.tabHeaderItem, tabItemClassName)} 
                activeTabItemClassName={cs(secondary ? styles.tabHeaderSecondaryItemActive : styles.tabHeaderItemActive, activeTabItemClassName)}
                {...tabProps} 
            />
        </div>
    );
};

export default _Tabs;

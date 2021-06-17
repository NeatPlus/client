import {useCallback} from 'react';
import {MdClose} from 'react-icons/md';

import Modal from '@ra/components/Modal';
import Tabs, {Tab} from 'components/Tabs';

import cs from '@ra/cs';

import styles from './styles.scss';

const SummaryModal = props => {
    const {isVisible, onClose, activeSeverity, setActiveSeverity} = props;

    const renderTabsHeader = useCallback(tabHeaderProps => {
        const {title, active, ...rest} = tabHeaderProps;
        return (
            <div className={cs(styles.headerItem, {
                [styles.headerItemInactive]: !active,
                [styles.headerItemHigh]: active && title==='High',
                [styles.headerItemMedium]: active && title === 'Medium',
                [styles.headerItemLow]: active && title==='Low'
            })} {...rest}>
                {title}
            </div>
        );
    }, []);

    const handleChangeTab = useCallback(({activeTab}) => {
        setActiveSeverity(activeTab);
    }, [setActiveSeverity]);

    if(!isVisible) {
        return null;
    }
    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Statements Severity Summary</h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <Tabs
                    secondary 
                    className={styles.tabs}
                    headerClassName={styles.tabsHeader}
                    renderHeader={renderTabsHeader}
                    contentContainerClassName={styles.tabContent}
                    activeTab={activeSeverity}
                    onChange={handleChangeTab}
                >
                    <Tab label="High" title="High">
                        HIGH CONCERNS
                    </Tab>
                    <Tab label="Medium" title="Medium">
                        MEDIUM CONCERNS
                    </Tab>
                    <Tab label="Low" title="Low">
                        LOW CONCERNS
                    </Tab>
                </Tabs>
            </div>
        </Modal>
    );   
};

export default SummaryModal;

import {useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {MdClose} from 'react-icons/md';

import List from '@ra/components/List';
import Modal from '@ra/components/Modal';
import Tabs, {Tab} from 'components/Tabs';

import cs from '@ra/cs';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './styles.scss';

const keyExtractor = item => item.id;

const StatementItem = ({item}) => {
    return (
        <div className={cs(styles.statement, styles[`statement${item.severity}`])}>
            {item.statement.title}
        </div>
    );
};

const StatementList = ({statements=[], severity}) => {
    const statementData = useMemo(() => 
        statements.filter(st => st.severity === severity),
    [statements, severity]);

    return (
        <List 
            data={statementData}
            keyExtractor={keyExtractor}
            renderItem={StatementItem}
        />
    );
};

const SummaryModal = props => {
    const {isVisible, onClose, activeSeverity, setActiveSeverity} = props;

    const {activeSurvey} = useSelector(state => state.survey);
    const {statements} = useSelector(state => state.statement);

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

    const statementData = useMemo(() => {
        return activeSurvey?.results?.map(res => ({
            ...res,
            statement: statements.find(st => st.id === res.statement),
        })) || [];
    }, [activeSurvey, statements]);

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
                        <StatementList 
                            statements={statementData} 
                            severity="High" 
                        />
                    </Tab>
                    <Tab label="Medium" title="Medium">
                        <StatementList 
                            statements={statementData} 
                            severity="Medium" 
                        />
                    </Tab>
                    <Tab label="Low" title="Low">
                        <StatementList 
                            statements={statementData} 
                            severity="Low" 
                        />
                    </Tab>
                </Tabs>
            </div>
        </Modal>
    );   
};

export default SummaryModal;

import {useState, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {BiChevronLeft, BiEditAlt} from 'react-icons/bi';
import {FiFilter} from 'react-icons/fi';

import Tabs, {Tab} from 'components/Tabs';
import Button from 'components/Button';

import Overview from './Overview';
import Module from './Module';

import styles from './styles.scss';

const SurveyDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const handleTabChange = useCallback(payload => setActiveTab(payload.activeTab), []);

    const renderHeaderControls = useCallback(tabHeaderProps => {
        if(activeTab === 'overview') {
            return null;
        }
        return (
            <div className={styles.headerControls}>
                <Button className={styles.controlButton}>
                    <BiEditAlt size={20} className={styles.controlIcon} />
                    Edit
                </Button>
                <Button className={styles.controlButton}>
                    <FiFilter size={18} className={styles.controlIcon} />
                    Filters
                </Button>
            </div>
        );
    }, [activeTab]);

    const renderSpacer = useCallback(() => {
        if (activeTab==='overview') {
            return null;
        }
        return <div className={styles.spacer} />;
    }, [activeTab]);

    return (
        <div className={styles.container}>
            {/* FIXME: Use active project id */}
            <Link to="/projects/1/surveys/" className={styles.backLink}>
                <BiChevronLeft size={22} className={styles.backIcon} /> Back to Surveys
            </Link>
            <Tabs 
                defaultActiveTab="overview"
                secondary 
                className={styles.tabs}
                renderPreHeaderComponent={renderSpacer}
                renderPostHeaderComponent={renderHeaderControls}
                headerContainerClassName={styles.headerContainer}
                headerClassName={styles.tabsHeader}
                tabItemClassName={styles.headerItem}
                contentContainerClassName={styles.tabContent}
                onChange={handleTabChange}
            >
                <Tab label="overview" title="Overview">
                    <Overview />
                </Tab>
                <Tab label="sensitivity" title="Sensitivity">
                    <Module type="sensitivity" />
                </Tab>
                <Tab label="shelter" title="Shelter">
                    <Module type="shelter" />
                </Tab>
                <Tab label="wash" title="WASH">
                    <Module type="wash" />
                </Tab>
                <Tab label="fs" title="FS">
                    <Module type="fs" />
                </Tab>
            </Tabs>
        </div>
    ); 
};

export default SurveyDashboard;

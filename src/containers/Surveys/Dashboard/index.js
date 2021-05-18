import {Link} from 'react-router-dom';
import {BiChevronLeft} from 'react-icons/bi';

import Tabs, {Tab} from 'components/Tabs';

import Overview from './Overview';
import styles from './styles.scss';

const SurveyDashboard = () => {
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
                headerClassName={styles.tabsHeader}
                tabItemClassName={styles.headerItem}
                contentContainerClassName={styles.tabContent}
            >
                <Tab label="overview" title="Overview">
                    <Overview />
                </Tab>
                <Tab label="sensitivity" title="Sensitivity">
                </Tab>
                <Tab label="shelter" title="Shelter">
                </Tab>
                <Tab label="wash" title="WASH">
                </Tab>
                <Tab label="fs" title="FS">
                </Tab>
            </Tabs>
        </div>
    ); 
};

export default SurveyDashboard;

import {useCallback, useState} from 'react';
import {Link, useLocation, useParams, useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {BiChevronLeft} from 'react-icons/bi';

import {withNoSurvey} from 'components/NoSurvey';
import TakeSurveyModal from 'components/TakeSurveyModal';
import Tabs, {Tab} from 'components/Tabs';
import Map from 'components/Map';
import ConcernsTable from 'components/Concerns/Table';
import ConcernsChart from 'components/Concerns/Chart';

import SurveyList from 'containers/Surveys/List';

import useInitActiveProject from 'hooks/useInitActiveProject';

import SurveyTable from './SurveyTable';
import styles from './styles.scss';

const ProjectDashboard = withNoSurvey(() => {
    const history = useHistory();
    const location = useLocation();
    const {projectId} = useParams();
    
    useInitActiveProject(projectId);

    const {activeProject} = useSelector(state => state.project);

    const [showTakeSurveyModal, setShowTakeSurveyModal] = useState(false);
    const handleShowTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(true), []);
    const handleHideTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(false), []);
    
    const handleTabChange = useCallback(({activeTab}) => {
        if(activeTab === 'summary') {
            return history.push(`/projects/${projectId}/`);
        }
        return history.push(`/projects/${projectId}/surveys/`);
    }, [projectId, history]);

    const handleSurveyComplete = useCallback(() => {
        // TODO: Refresh table data
    }, []);

    return (
        <div className={styles.container}>
            <Link to="/projects" className={styles.backLink}>
                <BiChevronLeft size={22} className={styles.backIcon} /> Back to Projects
            </Link>
            <Tabs 
                activeTab={location.pathname.includes('surveys') ? 'surveys' : 'summary'}
                secondary 
                className={styles.tabs} 
                headerClassName={styles.tabsHeader}
                onChange={handleTabChange}
            >
                <Tab label="summary" title="Summary">
                    <div className={styles.summaryContainer}>
                        <SurveyTable onTakeSurveyClick={handleShowTakeSurveyModal} />
                        <div className={styles.overview}>
                            <h3 className={styles.overviewTitle}>Overview</h3>
                            <div className={styles.overviewContent}>
                                <div className={styles.concerns}>
                                    <h4 className={styles.concernsTitle}>Top concerns topics</h4>
                                    <div className={styles.concernsTable}>
                                        <ConcernsTable />
                                    </div>
                                    <div className={styles.concernsChart}>
                                        <ConcernsChart />
                                    </div>
                                </div>
                                <div className={styles.location}>
                                    <h4 className={styles.locationTitle}>Number of issues of concern by location</h4>
                                    <div className={styles.map}>
                                        <Map project={activeProject} showPopup />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab label="surveys" title="Surveys">
                    <SurveyList />
                </Tab>
            </Tabs>
            <TakeSurveyModal 
                isVisible={showTakeSurveyModal} 
                onComplete={handleSurveyComplete} 
                onClose={handleHideTakeSurveyModal} 
            />
        </div>
    );
});

export default ProjectDashboard;

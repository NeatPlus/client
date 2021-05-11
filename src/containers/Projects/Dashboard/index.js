import {useCallback, useState} from 'react';
import {Link, useLocation, useParams, useHistory} from 'react-router-dom';
import {BsPlus} from 'react-icons/bs';
import {BiChevronLeft} from 'react-icons/bi';

import Button from 'components/Button';
import {withNoSurvey} from 'components/NoSurvey';
import TakeSurveyModal from 'components/TakeSurveyModal';
import Tabs, {Tab} from 'components/Tabs';

import Surveys from 'containers/Surveys';

import styles from './styles.scss';

const ProjectDashboard = withNoSurvey(() => {
    const history = useHistory();
    const location = useLocation();
    const {projectId} = useParams();

    const [showTakeSurveyModal, setShowTakeSurveyModal] = useState(false);
    const handleShowTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(true), []);
    const handleHideTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(false), []);

    const handleTabChange = useCallback(({activeTab}) => {
        if(activeTab === 'summary') {
            return history.push(`/projects/${projectId}`);
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
                defaultActiveTab={location.pathname.includes('surveys') ? 'surveys' : 'summary'}
                secondary 
                className={styles.tabs} 
                headerClassName={styles.tabsHeader}
                onChange={handleTabChange}
            >
                <Tab label="summary" title="Summary">
                    <div className={styles.summaryContainer}>
                        <div className={styles.surveys}>
                            <div className={styles.surveyHeader}>
                                <h3 className={styles.surveyTitle}>Surveys</h3>
                                <Button outline onClick={handleShowTakeSurveyModal} className={styles.button}>
                                    <BsPlus size={20} className={styles.buttonIcon} /> Take Survey
                                </Button>
                            </div>
                            <p className={styles.subTitle}>10 surveys</p>
                            <div className={styles.surveyTable}>
                                SURVEYS TABLE
                            </div>
                        </div>
                        <div className={styles.overview}>
                            <h3 className={styles.overviewTitle}>Overview</h3>
                            <div className={styles.overviewContent}>
                                <div className={styles.concerns}>
                                    <h4 className={styles.concernsTitle}>Top concerns category</h4>
                                    <div className={styles.concernsTable}>
                                        CONCERNS TABLE
                                    </div>
                                    <div className={styles.concernsChart}>
                                        CONCERNS CHART
                                    </div>
                                </div>
                                <div className={styles.location}>
                                    <h4 className={styles.locationTitle}>Number of issues of concern by location</h4>
                                    <div className={styles.map}>
                                        MAP
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab label="surveys" title="Surveys">
                    <Surveys />
                </Tab>
            </Tabs>
            <TakeSurveyModal isVisible={showTakeSurveyModal} onComplete={handleSurveyComplete} onClose={handleHideTakeSurveyModal} />
        </div>
    );
});

export default ProjectDashboard;
import {useCallback} from 'react';
import {Link, useLocation, useParams, useHistory} from 'react-router-dom';

import {withNoSurvey} from 'components/NoSurvey';
import Tabs, {Tab} from 'components/Tabs';

import Surveys from 'containers/Surveys';

import styles from './styles.scss';

const ProjectDashboard = withNoSurvey(() => {
    const history = useHistory();
    const location = useLocation();
    const {projectId} = useParams();

    const handleTabChange = useCallback(({activeTab}) => {
        if(activeTab === 'summary') {
            return history.push(`/projects/${projectId}`);
        }
        return history.push(`/projects/${projectId}/surveys/`);
    }, [projectId, history]);

    return (
        <div className={styles.container}>
            <Link to="/projects" className={styles.backLink}>Back to Projects</Link>
            <Tabs 
                defaultActiveTab={location.pathname.includes('surveys')?'surveys':'summary'}
                secondary 
                className={styles.tabs} 
                headerClassName={styles.tabsHeader}
                onChange={handleTabChange}
            >
                <Tab label="summary" title="Summary">
                    SUMMARY
                </Tab>
                <Tab label="surveys" title="Surveys">
                    <Surveys />
                </Tab>
            </Tabs>
        </div>
    );
});

export default ProjectDashboard;

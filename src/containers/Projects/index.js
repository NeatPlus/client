import {useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AiOutlineFileText} from 'react-icons/ai';

import FloatingAction from 'components/FloatingAction';
import UserNav from 'components/UserNav';
import SurveyDashboard from 'containers/Surveys/Dashboard';

import Api from 'services/api';
import cs from '@ra/cs';

import List from './List';
import Dashboard from './Dashboard';

import styles from './styles.scss';

const Projects = () => {
    useEffect(() => {
        Api.getSurveys();
    }, []);

    const {projectId, title} = useSelector(state => state.draft);

    return (
        <div className={cs(styles.container, 'no-bgcolor')}>
            <UserNav />
            <div className={styles.content}>
                <Switch>
                    <Route exact path='/projects/' component={List} />
                    <Route exact path='/projects/:projectId/surveys/:surveyId' component={SurveyDashboard} />
                    <Route exact path='/projects/:projectId/surveys' component={Dashboard} />
                    <Route path='/projects/:projectId' component={Dashboard} />
                </Switch>
            </div>
            {projectId && !!title && (
                <FloatingAction surveyTitle={title} icon={AiOutlineFileText} />
            )}
        </div>
    );
};

export default Projects;

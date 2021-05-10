import { Route, Switch } from 'react-router-dom';

import SurveyDashboard from './Dashboard';
import SurveyList from './List';

import styles from './styles.scss';

const Surveys = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Switch>
                    <Route exact path="/projects/:projectId/surveys/:surveyId" component={SurveyDashboard}/>
                    <Route exact path="/projects/:projectId/surveys" component={SurveyList} />
                </Switch>
            </div>
        </div>
    );
};

export default Surveys;

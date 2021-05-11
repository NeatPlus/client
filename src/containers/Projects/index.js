import {Route, Switch} from 'react-router-dom';

import UserNav from 'components/UserNav';

import List from './List';
import Dashboard from './Dashboard';

import styles from './styles.scss';

const Projects = () => {
    return (
        <div className={styles.container}>
            <UserNav />
            <div className={styles.content}>
                <Switch>
                    <Route exact path='/projects/' component={List} />
                    <Route exact path='/projects/:projectId/surveys' component={Dashboard} />
                    <Route path='/projects/:projectId' component={Dashboard} />
                </Switch>
            </div>
        </div>
    );
};

export default Projects;
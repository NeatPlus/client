import { Route, Switch } from 'react-router-dom';

import UserNav from 'components/UserNav';

import Dashboard from './Dashboard';

import styles from './styles.scss';

const Surveys = () => {
    return (
        <div class={styles.container}>
            <UserNav/>
            <div className={styles.content}>
                <Switch>
                    <Route exact path='/surveys/' component={Dashboard}/>
                </Switch>
            </div>
        </div>
    );
};

export default Surveys;

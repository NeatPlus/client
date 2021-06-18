import {useCallback, useEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';

import UserNav from 'components/UserNav';
import SurveyDashboard from 'containers/Surveys/Dashboard';

import List from './List';
import Dashboard from './Dashboard';
import Search from './Search';
import Api from 'services/api';

import styles from './styles.scss';

const Projects = () => {
    const [searchedProject, setSearchedProject] = useState([]);
    const [searchedText, setSearchedText] = useState('');

    useEffect(() => {
        Api.getProjects();
        Api.getSurveys();
    }, []);

    const renderSearchInput = useCallback(() => {
        return (
            <Search
                setSearchedProject={setSearchedProject}
                setSearchedText={setSearchedText}
            />
        );
    }, []);

    return (
        <div className={styles.container}>
            <UserNav renderCenterContent={renderSearchInput} />
            <div className={styles.content}>
                <Switch>
                    <Route exact path='/projects/'>
                        <List
                            searchedProject={searchedProject}
                            searchedText={searchedText}
                        />
                    </Route>
                    <Route
                        exact
                        path='/projects/:projectId/surveys/:surveyId'
                        component={SurveyDashboard}
                    />
                    <Route
                        exact
                        path='/projects/:projectId/surveys'
                        component={Dashboard}
                    />
                    <Route path='/projects/:projectId' component={Dashboard} />
                </Switch>
            </div>
        </div>
    );
};

export default Projects;

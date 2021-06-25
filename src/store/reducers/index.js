import {combineReducers} from 'redux';

import authReducer from './auth';
import userReducer from './user';
import organizationReducer from './organization';
import projectReducer from './project';
import surveyReducer from './survey';
import questionReducer from './question';
import statementReducer from './statement';
import dashboardReducer from './dashboard';
import uiReducer from './ui';
import weightageReducer from './weightage';

export default combineReducers({
    auth: authReducer,
    user: userReducer,
    organization: organizationReducer,
    project: projectReducer,
    survey: surveyReducer,
    question: questionReducer,
    statement: statementReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    weightage: weightageReducer,
});

import {combineReducers} from 'redux';

import authReducer from './auth';
import organizationReducer from './organization';
import contextReducer from './context';
import projectReducer from './project';
import surveyReducer from './survey';
import questionReducer from './question';
import statementReducer from './statement';
import dashboardReducer from './dashboard';
import uiReducer from './ui';
import weightageReducer from './weightage';
import notificationReducer from './notification';
import noticeReducer from './notice';
import draftReducer from './draft';
import legislationReducer from './legislation';

export default combineReducers({
    auth: authReducer,
    context: contextReducer,
    organization: organizationReducer,
    project: projectReducer,
    survey: surveyReducer,
    question: questionReducer,
    statement: statementReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    weightage: weightageReducer,
    notification: notificationReducer,
    notice: noticeReducer,
    draft: draftReducer,
    legislation: legislationReducer
});

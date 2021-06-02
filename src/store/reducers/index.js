import {combineReducers} from 'redux';

import authReducer from './auth';
import userReducer from './user';
import organizationReducer from './organization';
import projectReducer from './project';
import surveyReducer from './survey';
import uiReducer from './ui';

export default combineReducers({
    auth: authReducer,
    user: userReducer,
    organization: organizationReducer,
    project: projectReducer,
    survey: surveyReducer,
    ui: uiReducer,
});

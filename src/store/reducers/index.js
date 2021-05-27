import {combineReducers} from 'redux';

import authReducer from './auth';
import organizationReducer from './organization';
import projectReducer from './project';
import uiReducer from './ui';

export default combineReducers({
    auth: authReducer,
    organization: organizationReducer,
    project: projectReducer,
    ui: uiReducer,
});

import {combineReducers} from 'redux';

import authReducer from './auth';
import uiReducer from './ui';

export default combineReducers({
    auth: authReducer,
    ui: uiReducer,
});

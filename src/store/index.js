import {compose, applyMiddleware, createStore} from 'redux';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './reducers';

const middlewares = [];
 
if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger');
 
    middlewares.push(logger);
}

const migrations = {
    0: state => {
        return {...state, draft: {
            drafts: state.draft.projectId ? [
                {
                    projectId: state.draft.projectId,
                    title: state.draft.title,
                    surveyId: state.draft.surveyId,
                    moduleCode: state.draft.moduleCode,
                    answers: state.draft.draftAnswers,
                }
            ] : []
        }};
    },
};

const persistConfig = {
    key: 'root',
    version: 0,
    storage,
    whitelist: ['draft'],
    migrate: createMigrate(migrations)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = compose(applyMiddleware(...middlewares))(createStore)(persistedReducer);
const persistor = persistStore(store);

export {persistor};

export default store;

import {compose, applyMiddleware, createStore} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './reducers';

const middlewares = [];
 
if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger');
 
    middlewares.push(logger);
}

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['draft'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = compose(applyMiddleware(...middlewares))(createStore)(persistedReducer);
const persistor = persistStore(store);

export {persistor};

export default store;

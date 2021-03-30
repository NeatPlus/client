import {compose, applyMiddleware, createStore} from 'redux';

import reducer from './reducers';

const middlewares = [];
 
if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger');
 
    middlewares.push(logger);
}
 
const store = compose(applyMiddleware(...middlewares))(createStore)(reducer);

export default store;

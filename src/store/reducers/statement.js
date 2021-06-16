import * as actions from 'store/actions/statement';

const initialState = {
    status: 'idle',
    statements: [],
    topics: [],
};

const statementReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_STATEMENTS:
        return {...state, statements: action.statements};
    case actions.SET_TOPICS:
        return {...state, topics: action.topics};
    default:
        return state;
    }
};

export default statementReducer;

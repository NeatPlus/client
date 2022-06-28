import * as actions from 'store/actions/weightage';

const initialState = {
    status: 'idle',
    questionStatements: [],
    optionStatements: [],
    statementFunctions: [],
};

const weightageReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_QUESTION_STATEMENTS:
        return {...state, questionStatements: action.questionStatements};
    case actions.SET_OPTION_STATEMENTS:
        return {...state, optionStatements: action.optionStatements};
    case actions.SET_STATEMENT_FUNCTIONS:
        return {...state, statementFunctions: action.statementFunctions};
    default:
        return state;
    }
};

export default weightageReducer;

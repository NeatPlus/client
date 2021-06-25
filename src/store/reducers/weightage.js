import * as actions from 'store/actions/weightage';

const initialState = {
    status: 'idle',
    questionStatements: [],
    optionStatements: [],
};

const weightageReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_QUESTION_STATEMENTS:
        return {...state, questionStatements: action.questionStatements};
    case actions.SET_OPTION_STATEMENTS:
        return {...state, optionStatements: action.optionStatements};
    default:
        return state;
    }
};

export default weightageReducer;

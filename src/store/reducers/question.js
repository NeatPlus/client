import * as actions from 'store/actions/question';

const initialState = {
    status: 'idle',
    questionGroups: [],
    questions: {},
    options: [],
    answers: [],
};

const questionReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_QUESTION_GROUPS:
        return {...state, questionGroups: action.questionGroups};
    case actions.SET_QUESTIONS:
        return {...state, questions: action.questions};
    case actions.SET_OPTIONS:
        return {...state, options: action.options};
    case actions.SET_ANSWERS:
        return {...state, answers: action.answers};
    default:
        return state;
    }
};

export default questionReducer;

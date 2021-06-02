import * as actions from 'store/actions/survey';

const initialState = {
    status: 'idle',
    surveys: [],
    questionGroups: [],
};

const surveyReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_SURVEYS:
        return {...state, surveys: action.surveys};
    case actions.SET_QUESTION_GROUPS:
        return {...state, questionGroups: action.questionGroups};
    case actions.SET_QUESTIONS:
        return {...state, questions: action.questions};
    default:
        return state;
    }
};

export default surveyReducer;

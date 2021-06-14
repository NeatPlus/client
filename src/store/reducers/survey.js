import * as actions from 'store/actions/survey';

const initialState = {
    status: 'idle',
    surveys: [],
    activeSurvey: null,
    surveyAnswers: [],
};

const surveyReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_SURVEYS:
        return {...state, surveys: action.surveys};
    case actions.SET_ACTIVE_SURVEY:
        return {...state, activeSurvey: action.survey};
    case actions.SET_SURVEY_ANSWERS:
        return {...state, surveyAnswers: action.answers};
    default:
        return state;
    }
};

export default surveyReducer;

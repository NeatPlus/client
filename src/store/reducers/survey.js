import * as actions from 'store/actions/survey';

const initialState = {
    status: 'idle',
    surveys: [],
    activeSurvey: null,
    surveyAnswers: [],
    surveyResults: [],
    advancedFeedbacks: [],
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
    case actions.SET_SURVEY_RESULTS:
        return {...state, surveyResults: action.results};
    case actions.SET_ADVANCED_FEEDBACKS:
        return {...state, advancedFeedbacks: action.feedbacks};
    default:
        return state;
    }
};

export default surveyReducer;

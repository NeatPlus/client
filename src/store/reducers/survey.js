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
    case actions.SET_SURVEYS: {
        const newSurveys = action.surveys.filter(sr => !state.surveys.some(existingSurvey => {
            return existingSurvey.id === sr.id;
        }));
        return {...state, surveys: [...state.surveys, ...newSurveys]};
    }
    case actions.UPDATE_SURVEY: {
        const newSurveys = [...state.surveys];
        const surveyIdx = newSurveys.findIndex(sur => sur.id === action.survey.id);
        if(surveyIdx > -1) {
            newSurveys.splice(surveyIdx, 1, action.survey);
        } else {
            newSurveys.push(action.survey);
        }
        return {...state, surveys: newSurveys};
    }
    case actions.REMOVE_SURVEY: {
        const newSurveys = state.surveys.filter(sur => sur.id !== action.surveyId);
        const newSurveyAnswers = state.surveyAnswers.filter(surAns => surAns.survey !== action.surveyId);
        const newSurveyResults = state.surveyResults.filter(surRes => surRes.survey !== action.surveyId);
        return {...state, surveys: newSurveys, surveyAnswers: newSurveyAnswers, surveyResults: newSurveyResults};
    }
    case actions.SET_ACTIVE_SURVEY:
        return {...state, activeSurvey: action.survey};
    case actions.SET_SURVEY_ANSWERS: {
        const stateAnswersToPersist = state.surveyAnswers.filter(ans => !action.answers.some(updatedAnswer => {
            return updatedAnswer.survey === ans.survey; 
        }));
        return {...state, surveyAnswers: [...stateAnswersToPersist, ...action.answers]};
    }
    case actions.SET_SURVEY_RESULTS: {
        const stateResultsToPersist = state.surveyResults.filter(res => !action.results.some(updatedResult => {
            return updatedResult.survey === res.survey;
        }));
        return {...state, surveyResults: [...stateResultsToPersist, ...action.results]};
    }
    case actions.SET_ADVANCED_FEEDBACKS:
        return {...state, advancedFeedbacks: action.feedbacks};
    default:
        return state;
    }
};

export default surveyReducer;

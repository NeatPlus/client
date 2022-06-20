import * as actions from 'store/actions/admin';

const initialState = {
    changedQuestions: [],
    changedOptions: [],
    baselineSurveyAnswers: [],
};

const contextReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_CHANGED_OPTIONS:
        return {...state, changedOptions: action.options};
    case actions.SET_CHANGED_QUESTIONS:
        return {...state, changedQuestions: action.questions};
    case actions.CLEAR_WEIGHTAGE_CHANGES:
        return {...state, changedOptions: [], changedQuestions: []};
    case actions.ADD_BASELINE_SURVEY_ANSWERS:
        return {
            ...state,
            baselineSurveyAnswers: [
                ...state.baselineSurveyAnswers,
                {
                    survey: action.survey,
                    surveyAnswers: action.surveyAnswers,
                },
            ],
        };
    default:
        return state;
    }
};

export default contextReducer;

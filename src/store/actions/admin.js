export const SET_CHANGED_OPTIONS = 'SET_CHANGED_OPTIONS';
export const SET_CHANGED_QUESTIONS = 'SET_CHANGED_QUESTIONS';
export const CLEAR_WEIGHTAGE_CHANGES = 'CLEAR_WEIGHTAGE_CHANGES';
export const ADD_BASELINE_SURVEY_ANSWERS = 'ADD_BASELINE_SURVEY_ANSWERS';

export function setChangedOptions(options) {
    return {type: SET_CHANGED_OPTIONS, options};
}

export function setChangedQuestions(questions) {
    return {type: SET_CHANGED_QUESTIONS, questions};
}

export function resetWeightages() {
    return {type: CLEAR_WEIGHTAGE_CHANGES};
}

export function addBaselineSurveyAnswers(survey, surveyAnswers) {
    return {type: ADD_BASELINE_SURVEY_ANSWERS, survey, surveyAnswers};
}

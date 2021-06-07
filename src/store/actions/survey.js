export const SET_STATUS = 'SET_STATUS';
export const SET_SURVEYS = 'SET_SURVEYS';
export const SET_QUESTION_GROUPS = 'SET_QUESTION_GROUPS';
export const SET_QUESTIONS = 'SET_QUESTIONS';
export const SET_OPTIONS = 'SET_OPTIONS';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setSurveys(surveys) {
    return {type: SET_SURVEYS, surveys};
}

export function setQuestionGroups(questionGroups) {
    return {type: SET_QUESTION_GROUPS, questionGroups};
}

export function setQuestions(questions) {
    return {type: SET_QUESTIONS, questions};
}

export function setOptions(options) {
    return {type: SET_OPTIONS, options};
}


export const SET_STATUS = 'SET_STATUS';
export const SET_QUESTION_GROUPS = 'SET_QUESTION_GROUPS';
export const SET_QUESTIONS = 'SET_QUESTIONS';
export const SET_OPTIONS = 'SET_OPTIONS';
export const SET_ANSWERS = 'SET_ANSWERS';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setQuestionGroups(questionGroups) {
    return {type: SET_QUESTION_GROUPS, questionGroups};
}

export function setQuestions(code, questions) {
    return {type: SET_QUESTIONS, code, questions};
}

export function setOptions(options) {
    return {type: SET_OPTIONS, options};
}

export function setAnswers(answers) {
    return {type: SET_ANSWERS, answers};
}

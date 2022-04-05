export const SET_CHANGED_OPTIONS = 'SET_CHANGED_OPTIONS';
export const SET_CHANGED_QUESTIONS = 'SET_CHANGED_QUESTIONS';

export function setChangedOptions(options) {
    return {type: SET_CHANGED_OPTIONS, options};
}

export function setChangedQuestions(questions) {
    return {type: SET_CHANGED_QUESTIONS, questions};
}

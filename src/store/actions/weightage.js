export const SET_STATUS = 'SET_STATUS';
export const SET_QUESTION_STATEMENTS = 'SET_QUESTION_STATEMENTS';
export const SET_OPTION_STATEMENTS = 'SET_OPTION_STATEMENTS';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setQuestionStatements(questionStatements) {
    return {type: SET_QUESTION_STATEMENTS, questionStatements};
}

export function setOptionStatements(optionStatements) {
    return {type: SET_OPTION_STATEMENTS, optionStatements};
}

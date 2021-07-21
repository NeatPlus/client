export const SET_PROJECT_ID = 'SET_PROJECT_ID';
export const SET_TITLE = 'SET_TITLE';
export const SET_DRAFT_ANSWERS = 'SET_DRAFT_ANSWERS';
export const SET_DRAFT_MODULE = 'SET_DRAFT_MODULE';

export function setProjectId(id) {
    return {type: SET_PROJECT_ID, id};
}

export function setTitle(title) {
    return {type: SET_TITLE, title};
}

export function setDraftAnswers(answers) {
    return {type: SET_DRAFT_ANSWERS, answers};
}

export function setDraftModule(code) {
    return {type: SET_DRAFT_MODULE, code};
}

export const SET_PROJECT_ID = 'SET_PROJECT_ID';
export const SET_TITLE = 'SET_TITLE';
export const SET_DRAFT_ANSWERS = 'SET_DRAFT_ANSWERS';

export function setProjectId(id) {
    return {type: SET_PROJECT_ID, id};
}

export function setTitle(title) {
    return {type: SET_TITLE, title};
}

export function setDraftAnswers(answers) {
    return {type: SET_DRAFT_ANSWERS, answers};
}

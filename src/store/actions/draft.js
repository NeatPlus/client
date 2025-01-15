export const ADD_DRAFT_SURVEY = 'ADD_DRAFT_SURVEY';
export const SET_TITLE = 'SET_TITLE';
export const SET_DRAFT_ANSWERS = 'SET_DRAFT_ANSWERS';
export const SET_SURVEY_ID = 'SET_SURVEY_ID';

export function addDraftSurvey(draft) {
    return {type: ADD_DRAFT_SURVEY, draft};
}

export function setDraftAnswers(answers, draftIndex) {
    return {type: SET_DRAFT_ANSWERS, answers, draftIndex};
}

export function setTitle(title, draftIndex) {
    return {type: SET_TITLE, title, draftIndex};
}

export function setSurveyId(id, draftIndex) {
    return {type: SET_SURVEY_ID, id, draftIndex};
}

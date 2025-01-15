import * as actions from 'store/actions/draft';

const initialState = {
    drafts: []
};

const draftReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.ADD_DRAFT_SURVEY:
        state.drafts = [...state.drafts, action.draft];
        return state;
    case actions.SET_TITLE:
        return updateStateDraftPropertyByIndex(state, action.draftIndex, 'title', action.title);
    case actions.SET_DRAFT_ANSWERS:
        return updateStateDraftPropertyByIndex(state, action.draftIndex, 'answers', action.answers);
    case actions.SET_SURVEY_ID:
        return updateStateDraftPropertyByIndex(state, action.draftIndex, 'surveyId', action.surveyId);
    default:
        return state;
    }
};

export default draftReducer;

function updateStateDraftPropertyByIndex(state, index, key, value) {
    if(isNaN(index) || index < 0) {
        return state;
    }
    return {
        ...state,
        drafts: state.drafts.slice(0, index).concat(
            [{
                ...state.drafts[index],
                [key]: value
            }, ...state.drafts.slice(index + 1)]
        )
    };
}

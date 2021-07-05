import * as actions from 'store/actions/draft';

const initialState = {
    projectId: null,
    title: '',
    draftAnswers: [],
};

const draftReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.SET_PROJECT_ID:
        return {...state, projectId: action.id};
    case actions.SET_TITLE:
        return {...state, title: action.title};
    case actions.SET_DRAFT_ANSWERS:
        return {...state, draftAnswers: action.answers};
    default:
        return state;
    }
};

export default draftReducer;

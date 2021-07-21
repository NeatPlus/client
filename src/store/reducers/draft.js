import * as actions from 'store/actions/draft';

const initialState = {
    projectId: null,
    title: '',
    draftAnswers: [],
    moduleCode: 'sens',
};

const draftReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.SET_PROJECT_ID:
        return {...state, projectId: action.id};
    case actions.SET_TITLE:
        return {...state, title: action.title};
    case actions.SET_DRAFT_ANSWERS:
        return {...state, draftAnswers: action.answers};
    case actions.SET_DRAFT_MODULE:
        return {...state, moduleCode: action.code};
    default:
        return state;
    }
};

export default draftReducer;

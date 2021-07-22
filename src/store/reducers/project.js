import * as actions from 'store/actions/project';

const initialState = {
    status: 'idle',
    activeProject: null,
};

const projectReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_ACTIVE_PROJECT:
        return {...state, activeProject: action.project};
    default:
        return state;
    }
};

export default projectReducer;

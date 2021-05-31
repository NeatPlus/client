import * as actions from 'store/actions/project';

const initialState = {
    status: 'idle',
    projects: [],
};

const projectReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_PROJECTS:
        return {...state, projects: action.projects};
    default:
        return state;
    }
};

export default projectReducer;

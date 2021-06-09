import * as actions from 'store/actions/survey';

const initialState = {
    status: 'idle',
    surveys: [],
};

const surveyReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_SURVEYS:
        return {...state, surveys: action.surveys};
    default:
        return state;
    }
};

export default surveyReducer;

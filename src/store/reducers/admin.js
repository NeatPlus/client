import * as actions from 'store/actions/admin';

const initialState = {
    changedQuestions: [],
    changedOptions: [],
};

const contextReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_CHANGED_OPTIONS:
        return {...state, changedOptions: action.options};
    case actions.SET_CHANGED_QUESTIONS:
        return {...state, changedQuestions: action.questions};
    default:
        return state;
    }
};

export default contextReducer;

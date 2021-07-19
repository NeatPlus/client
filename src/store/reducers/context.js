import * as actions from 'store/actions/context';

const initialState = {
    contexts: [],
    modules: [],
};

const contextReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_CONTEXTS:
        return {...state, contexts: action.contexts};
    case actions.SET_MODULES:
        return {...state, modules: action.modules};
    default:
        return state;
    }
};

export default contextReducer;

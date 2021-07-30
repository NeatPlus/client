import * as actions from '../actions/legislation';

const initialState = {
    legislations: [],
};

const legislationReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_LEGISLATIONS:
        return {...state, legislations: action.legislations};
    default:
        return state;
    }
};

export default legislationReducer;

import * as actions from 'store/actions/organization';

const initialState = {
    organizations: [],
};

const organizationReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_ORGANIZATIONS:
        return {...state, organizations: action.organizations};
    default:
        return state;
    }
};

export default organizationReducer;

import * as actions from 'store/actions/organization';

const initialState = {
    status: 'idle',
    organizations: [],
    memberRequests: [],
};

const organizationReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_ORGANIZATIONS:
        return {...state, organizations: action.organizations};
    case actions.SET_MEMBER_REQUESTS:
        return {...state, memberRequests: action.requests};
    default:
        return state;
    }
};

export default organizationReducer;

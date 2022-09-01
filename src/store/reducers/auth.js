import * as actions from '../actions/auth';

let initialState = {
    isAuthenticated: false,
    user: {},
    adminOrganizations: [],
    memberOrganization: [],
};
const loggedOutState = initialState;

if (
    localStorage.getItem('user') &&
    JSON.parse(localStorage.getItem('user')).isAuthenticated
) {
    initialState = JSON.parse(localStorage.getItem('user'));
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.LOGIN:
        localStorage.setItem('user', JSON.stringify({...state, isAuthenticated: true}));
        return {...state, isAuthenticated: true};
    case actions.LOGOUT:
        localStorage.removeItem('user');
        return {...loggedOutState};
    case actions.SET_USER:
        localStorage.setItem('user', JSON.stringify({...state, user: action.user || {}}));
        return {...state, user: action.user || {}};
    case actions.SET_ADMIN_ORGANIZATIONS:
        return {...state, adminOrganizations: action.adminOrganizations };
    case actions.SET_MEMBER_ORGANIZATIONS:
        return {...state, memberOrganizations: action.memberOrganizations };
    default:
        return state;
    }
};

export default authReducer;


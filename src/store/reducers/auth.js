import * as actions from '../actions/auth';

let initialState = {
    isAuthenticated: false,
    user: {},
    login: {
        username: '',
        password: '',
    },
    token: null,
    refreshToken: null,
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
        localStorage.removeItem('activeCourseId');
        return {...loggedOutState};
    case actions.LOGIN_CRED:
        localStorage.setItem('user', JSON.stringify({...state, login: action.cred}));
        return {...state, login: action.cred};
    case actions.SET_USER:
        localStorage.setItem('user', JSON.stringify({...state, user: action.user || {}}));
        return {...state, user: action.user || {}};
    case actions.SET_TOKEN:
        localStorage.setItem('user', JSON.stringify({...state, token: action.token}));
        return {...state, token: action.token};
    case actions.SET_REFRESH_TOKEN:
        localStorage.setItem('user', JSON.stringify({...state, refreshToken: action.refreshToken}));
        return {...state, refreshToken: action.refreshToken};
    default:
        return state;
    }
};

export default authReducer;


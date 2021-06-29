import * as actions from 'store/actions/notification';

const initialState = {
    notifications: [],
    invitations: [],
};

const notificationReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_NOTIFICATIONS:
        return {...state, notifications: action.notifications};
    case actions.SET_INVITATIONS:
        return {...state, invitations: action.invitations};
    default:
        return state;
    }
};

export default notificationReducer;

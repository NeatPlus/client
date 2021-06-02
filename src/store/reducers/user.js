import * as actions from 'store/actions/user';

const initialState = {
    users: [],
};

const userReducer = (state=initialState, action) => {
    switch(action.type) {
    case actions.SET_USERS:
        return {...state, users: action.users};
    default:
        return state;
    }
};

export default userReducer;

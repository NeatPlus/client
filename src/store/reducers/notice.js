import * as actions from '../actions/notice';

const initialState = {
    notices: [],
};

const noticeReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_NOTICES:
        return {...state, notices: action.notices};
    default:
        return state;
    }
};

export default noticeReducer;

import * as actions from '../actions/ui';

let initialState = {
    toast: {
        duration: null,
        visible: false,
        status: 'neutral',
        message: '',
    }
};

const uiReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SHOW_TOAST:
        return {
            ...state,
            toast: {
                message: action.message,
                status: action.status,
                visible: true,
                duration: action.duration,
            }
        };
    case actions.HIDE_TOAST:
        return initialState;
    default:
        return state;
    }
};

export default uiReducer;


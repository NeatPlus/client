import store from 'store';
import * as uiActions from 'store/actions/ui';

const dispatch = store.dispatch;

const toastService = {
    NEUTRAL: uiActions.NEUTRAL,
    SUCCESS: uiActions.SUCCESS,
    DANGER: uiActions.DANGER,
    WARNING: uiActions.WARNING,
    show: (message, level=uiActions.NEUTRAL, duration=5) => {
        dispatch(uiActions.showToast(message, level, duration));
    },
    hide: () => {
        dispatch(uiActions.hideToast());
    }
};

export default toastService;

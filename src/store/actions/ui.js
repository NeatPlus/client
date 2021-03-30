export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';

export const DANGER = 'danger';
export const SUCCESS = 'success';
export const WARNING = 'warning';
export const NEUTRAL = 'neutral';

export const showToast = (message, status=NEUTRAL, duration=5) => {
    return {type: SHOW_TOAST, message, status, duration};
};

export const hideToast = (message, status, duration) => {
    return {type: HIDE_TOAST};
};

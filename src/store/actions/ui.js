export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const SHOW_EXPIRY_MODAL = 'SHOW_EXPIRY_MODAL';
export const HIDE_EXPIRY_MODAL = 'HIDE_EXPIRY_MODAL';

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

export const showExpiryModal = () => {
    return {type: SHOW_EXPIRY_MODAL};
};

export const hideExpiryModal = () => {
    return {type: HIDE_EXPIRY_MODAL};
};

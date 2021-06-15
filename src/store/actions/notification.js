export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const SET_INVITATIONS = 'SET_INVITATIONS';

export function setNotifications(notifications) {
    return {type: SET_NOTIFICATIONS, notifications};
}

export function setInvitations(invitations) {
    return {type: SET_INVITATIONS, invitations};
}

export const SET_USER='SET_USER';
export const LOGIN='LOGIN';
export const LOGOUT='LOGOUT';
export const SET_ADMIN_ORGANIZATIONS='SET_ADMIN_ORGANIZATIONS';
export const SET_MEMBER_ORGANIZATIONS='SET_MEMBER_ORGANIZATIONS';

export function login() {
    return { type: LOGIN };
}

export function setUser(user) {
    return { type: SET_USER, user };
}

export function logout() {
    return { type: LOGOUT };
}

export function setMemberOrganizations() {
    return { type: SET_MEMBER_ORGANIZATIONS };
}

export function setAdminOrganizations(adminOrganizations) {
    return { type: SET_ADMIN_ORGANIZATIONS, adminOrganizations };
}

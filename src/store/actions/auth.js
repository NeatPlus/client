export const SET_USER='SET_USER';
export const LOGIN='LOGIN';
export const LOGIN_CRED='LOGIN_CRED';
export const LOGOUT='LOGOUT';
export const SET_TOKEN='SET_TOKEN';
export const SET_REFRESH_TOKEN='SET_REFRESH_TOKEN';
export const SET_ADMIN_ORGANIZATIONS='SET_ADMIN_ORGANIZATIONS';
export const SET_MEMBER_ORGANIZATIONS='SET_MEMBER_ORGANIZATIONS';

export function login() {
    return { type: LOGIN };
}

export function setUser(user) {
    return { type: SET_USER, user };
}

export function setToken(token) {
    return { type: SET_TOKEN, token };
}

export function setRefreshToken(refreshToken) {
    return { type: SET_REFRESH_TOKEN, refreshToken };
}

export function setLoginCred(cred) {
    return { type: LOGIN_CRED, cred };
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

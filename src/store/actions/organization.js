export const SET_STATUS = 'SET_STATUS';
export const SET_ORGANIZATIONS = 'SET_ORGANIZATIONS';
export const SET_MEMBER_REQUESTS = 'SET_MEMBER_REQUESTS';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setOrganizations(organizations) {
    return {type: SET_ORGANIZATIONS, organizations};
}

export function setMemberRequests(requests) {
    return {type: SET_MEMBER_REQUESTS, requests};
}

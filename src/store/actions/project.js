export const SET_STATUS = 'SET_STATUS';
export const SET_PROJECTS = 'SET_PROJECTS';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setProjects(projects) {
    return {type: SET_PROJECTS, projects};
}

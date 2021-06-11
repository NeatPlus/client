export const SET_STATUS = 'SET_STATUS';
export const SET_PROJECTS = 'SET_PROJECTS';
export const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setProjects(projects) {
    return {type: SET_PROJECTS, projects};
}

export function setActiveProject(project) {
    return {type: SET_ACTIVE_PROJECT, project};
}

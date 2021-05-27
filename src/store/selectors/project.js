import {createSelector} from 'reselect';

const getProjects = state => state.project.projects;
const getOrganizations = state => state.organization.organizations;

export const getFormattedProjects = createSelector([getProjects, getOrganizations], (projects, organizations) => {
    return projects.map(project => ({
        ...project, 
        organization: organizations.find(org => org.id===project.organization)?.title,
    }));
});


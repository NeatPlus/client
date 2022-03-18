import {createSelector} from 'reselect';

const getOrganizations = state => state.organization.organizations;
const getUser = state => state.auth.user;

export const selectMyOrganizations = createSelector([
    getOrganizations,
    getUser,
], (organizations, user) => {
    if(!user?.id) {
        return [];
    }

    return organizations.reduce((acc, org) => {
        if(org.isAdmin) {
            acc.push({...org, role: 'admin'});
        } else if(org.isMember) {
            acc.push({...org, role: 'member'});
        }
        return acc;
    }, []);
});

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
        if(org.admins.some(adm => adm === user.id)) {
            acc.push({...org, role: 'admin'});
        } else if(org.members.some(mem => mem === user.id)) {
            acc.push({...org, role: 'member'});
        }
        return acc;
    }, []);
});

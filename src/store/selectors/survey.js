import {createSelector} from 'reselect';

const getSurveys = state => state.survey.surveys;
const getUsers = state => state.user.users;

export const getFormattedSurveys = createSelector([getSurveys, getUsers], (surveys, users) => {
    if(users.length===0) {
        return [];
    }
    return surveys?.map(survey => ({
        ...survey, 
        createdBy: users.find(usr => usr.id===survey.createdBy),
    })) || [];
});

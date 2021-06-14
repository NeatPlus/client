import {createSelector} from 'reselect';

const getSurveys = state => state.survey.surveys;
const getSurveyAnswers = state => state.survey.surveyAnswers;
const getQuestions = state => state.question.questions;
const getUsers = state => state.user.users;

export const getFormattedSurveys = createSelector([
    getSurveys, 
    getSurveyAnswers, 
    getUsers,
    getQuestions,
], (surveys, surveyAnswers, users, questions) => {
    if(users.length===0) {
        return [];
    }
    return surveys?.map(survey => ({
        ...survey, 
        createdBy: users.find(usr => usr.id===survey.createdBy),
        answers: surveyAnswers
            .filter(sur => survey && sur.survey === survey?.id)
            .map(srv => {
                const que = questions.find(q => q.id === srv.question);
                return {
                    ...srv,
                    question: {
                        id: que.id,
                        code: que.code,
                    },
                };
            }),
    })) || [];
});

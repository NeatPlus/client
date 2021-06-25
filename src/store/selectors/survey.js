import {createSelector} from 'reselect';

import {getSeverityFromScore} from 'utils/severity';

const getSurveys = state => state.survey.surveys;
const getSurveyAnswers = state => state.survey.surveyAnswers;
const getSurveyResults = state => state.survey.surveyResults;
const getQuestions = state => state.question.questions;
const getUsers = state => state.user.users;
const getStatements = state => state.statement.statements;

export const getFormattedSurveys = createSelector([
    getSurveys, 
    getSurveyAnswers,
    getSurveyResults,
    getUsers,
    getQuestions,
    getStatements,
], (surveys, surveyAnswers, surveyResults, users, questions, statements) => {
    if(!users.length || !statements.length) {
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
        results: surveyResults
            .filter(sur => survey && sur.survey === survey?.id)
            .map(res => {
                const statement = statements.find(st => st.id === res.statement);
                return {
                    ...res,
                    topic: statement.topic,
                    severity: getSeverityFromScore(res.score)
                };
            }),
    })) || [];
});

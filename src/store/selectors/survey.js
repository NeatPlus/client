import {createSelector} from 'reselect';

import {getSeverityFromScore} from 'utils/severity';

const getSurveys = state => state.survey.surveys;
const getSurveyModules = state => state.survey.surveyModules;
const getSurveyAnswers = state => state.survey.surveyAnswers;
const getSurveyResults = state => state.survey.surveyResults;
const getQuestions = state => state.question.questions;
const getStatements = state => state.statement.statements;

export const getFormattedSurveys = createSelector([
    getSurveys,
    getSurveyModules,
    getSurveyAnswers,
    getSurveyResults,
    getQuestions,
    getStatements,
], (surveys, surveyModules, surveyAnswers, surveyResults, questions, statements) => {
    if(!statements.length) {
        return [];
    }
    const allQuestions = Object.values(questions).flatMap(el => el);
    return surveys?.map(survey => ({
        ...survey, 
        config: typeof survey.config === 'string' ? JSON.parse(survey.config) : survey.config,
        surveyModules: surveyModules.filter(surveyModule => surveyModule.survey === survey.id),
        answers: surveyAnswers
            .filter(sur => survey && sur.survey === survey?.id)
            .map(srv => {
                const que = allQuestions.find(q => q.id === srv.question);
                return {
                    ...srv,
                    question: {
                        id: srv.question,
                        code: que?.code,
                    },
                };
            }).filter(srvey => Boolean(srvey)),
        results: surveyResults
            .filter(sur => survey && sur.survey === survey?.id)
            .map(res => {
                const statement = statements.find(st => st.id === res.statement);
                if(!statement) {
                    return undefined;
                }
                return {
                    ...res,
                    topic: statement.topic,
                    severity: getSeverityFromScore(res.score)
                };
            }).filter(result => Boolean(result)),
    })) || [];
});

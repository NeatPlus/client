import {createSelector} from 'reselect';

const getStatements = state => state.statement.statements;
const getMitigations = state => state.statement.mitigations;
const getOpportunities = state => state.statement.opportunities;

export const selectStatements = createSelector([
    getStatements,
    getMitigations, 
    getOpportunities,
], (statements, mitigations, opportunities) => {
    return statements?.map(statement => ({
        ...statement, 
        mitigations: mitigations.filter(mt => mt.statement===statement.id),
        opportunities: opportunities.filter(opp => opp.statement===statement.id),
    }) || []);
});


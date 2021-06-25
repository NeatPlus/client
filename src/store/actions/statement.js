export const SET_STATUS = 'SET_STATUS';
export const SET_STATEMENTS = 'SET_STATEMENTS';
export const SET_TOPICS = 'SET_TOPICS';
export const SET_MITIGATIONS = 'SET_MITIGATIONS';
export const SET_OPPORTUNITIES = 'SET_OPPORTUNITIES';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setStatements(statements) {
    return {type: SET_STATEMENTS, statements};
}

export function setTopics(topics) {
    return {type: SET_TOPICS, topics};
}

export function setMitigations(mitigations) {
    return {type: SET_MITIGATIONS, mitigations};
}

export function setOpportunities(opportunities) {
    return {type: SET_OPPORTUNITIES, opportunities};
}

export const SET_STATUS = 'SET_STATUS';
export const SET_STATEMENTS = 'SET_STATEMENTS';
export const SET_TOPICS = 'SET_TOPICS';

export function setStatus(status) {
    return {type: SET_STATUS, status};
}

export function setStatements(statements) {
    return {type: SET_STATEMENTS, statements};
}

export function setTopics(topics) {
    return {type: SET_TOPICS, topics};
}

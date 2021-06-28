import * as actions from 'store/actions/statement';

const initialState = {
    status: 'idle',
    statements: [],
    topics: [],
    statementTagGroups: [],
    statementTags: [],
    mitigations: [],
    opportunities: [],
};

const statementReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.SET_STATUS:
        return {...state, status: action.status};
    case actions.SET_STATEMENTS:
        return {...state, statements: action.statements};
    case actions.SET_TOPICS:
        return {...state, topics: action.topics};
    case actions.SET_STATEMENT_TAG_GROUPS:
        return {...state, statementTagGroups: action.tagGroups};
    case actions.SET_STATEMENT_TAGS:
        return {...state, statementTags: action.tags};
    case actions.SET_MITIGATIONS:
        return {...state, mitigations: action.mitigations};
    case actions.SET_OPPORTUNITIES:
        return {...state, opportunities: action.opportunities};
    default:
        return state;
    }
};

export default statementReducer;

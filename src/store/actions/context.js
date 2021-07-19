export const SET_CONTEXTS = 'SET_CONTEXTS';
export const SET_MODULES = 'SET_MODULES';

export function setContexts(contexts) {
    return {type: SET_CONTEXTS, contexts};
}

export function setModules(modules) {
    return {type: SET_MODULES, modules};
}

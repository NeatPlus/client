import * as actions from 'store/actions/dashboard';

const initialState = {
    isEditMode: false,
    removedItems: [],
    itemsToRemove: [],
    itemsToRestore: [],
    filters: [],
};

const dashboardReducer = (state = initialState, action) => {
    switch(action.type) {
    case actions.SET_EDIT_MODE:
        return {...state, isEditMode: action.isEditMode};
    case actions.SET_ITEMS_TO_REMOVE:
        return {...state, itemsToRemove: action.items};
    case actions.APPLY_REMOVE_ITEMS:
        return {...state, removedItems: [...state.removedItems, ...state.itemsToRemove], itemsToRemove: []};
    case actions.SET_ITEMS_TO_RESTORE:
        return {...state, itemsToRestore: action.items};
    case actions.APPLY_RESTORE_ITEMS:
        return {
            ...state,
            removedItems: state.removedItems.filter(item => {
                return !state.itemsToRestore.some(el => el.type===item.type && el.identifier === item.identifier);
            }),
        };
    case actions.SET_FILTERS:
        return {...state, filters: action.filters};
    default:
        return state;
    }
};

export default dashboardReducer;

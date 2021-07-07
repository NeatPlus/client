export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_REMOVED_ITEMS = 'SET_REMOVED_ITEMS';
export const SET_ITEMS_TO_REMOVE = 'SET_ITEMS_TO_REMOVE';
export const APPLY_REMOVE_ITEMS = 'APPLY_REMOVE_ITEMS';
export const SET_ITEMS_TO_RESTORE = 'SET_ITEMS_TO_RESTORE';
export const APPLY_RESTORE_ITEMS = 'APPLY_RESTORE_ITEMS';
export const SET_FILTERS = 'SET_FILTERS';

export function setEditMode(isEditMode) {
    return {type: SET_EDIT_MODE, isEditMode};
}

export function setRemovedItems(items) {
    return {type: SET_REMOVED_ITEMS, items};
}

export function setItemsToRemove(items) {
    return {type: SET_ITEMS_TO_REMOVE, items};
}

export function applyRemoveItems(removedItems) {
    return {type: APPLY_REMOVE_ITEMS, removedItems};
}

export function setItemsToRestore(items) {
    return {type: SET_ITEMS_TO_RESTORE, items};
}

export function applyRestoreItems(removedItems) {
    return {type: APPLY_RESTORE_ITEMS, removedItems};
}

export function setFilters(filters) {
    return {type: SET_FILTERS, filters};
}

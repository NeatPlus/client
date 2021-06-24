export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_ITEMS_TO_REMOVE = 'SET_ITEMS_TO_REMOVE';
export const APPLY_REMOVE_ITEMS = 'APPLY_REMOVE_ITEMS';
export const SET_ITEMS_TO_RESTORE = 'SET_ITEMS_TO_RESTORE';
export const APPLY_RESTORE_ITEMS = 'APPLY_RESTORE_ITEMS';

export function setEditMode(isEditMode) {
    return {type: SET_EDIT_MODE, isEditMode};
}

export function setItemsToRemove(items) {
    return {type: SET_ITEMS_TO_REMOVE, items};
}

export function applyRemoveItems() {
    return {type: APPLY_REMOVE_ITEMS};
}

export function setItemsToRestore(items) {
    return {type: SET_ITEMS_TO_RESTORE, items};
}

export function applyRestoreItems() {
    return {type: APPLY_RESTORE_ITEMS};
}

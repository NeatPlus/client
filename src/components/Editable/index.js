import React, {useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import cs from '@ra/cs';
import {setItemsToRemove} from 'store/actions/dashboard';

import styles from './styles.scss';

const Editable = ({children, type, identifier, accessor, module}) => {
    const dispatch = useDispatch();

    const {isEditMode, itemsToRemove} = useSelector(state => state.dashboard);
    
    const isItemToRemove = useMemo(() => 
        itemsToRemove.some(el => el.type === type && el.identifier === identifier && (el.module === module || (!el.module && module === 'sens'))), 
    [itemsToRemove, type, identifier, module]);

    const handleRemoveItem = useCallback(e => {
        e.stopPropagation();
        if(isItemToRemove) {
            return dispatch(setItemsToRemove(
                itemsToRemove.filter(
                    el => {
                        if(module === 'sens') {
                            return el.type !== type || el.identifier !== identifier;
                        } 
                        return el.type !== type || el.identifier !== identifier || el.module !== module;
                    }
                )
            ));
        }
        dispatch(setItemsToRemove([...itemsToRemove, {type, identifier, accessor, module}]));
    }, [dispatch, type, identifier, accessor, itemsToRemove, isItemToRemove, module]);

    if(!isEditMode) {
        return children;
    }

    return (
        <div className={cs(styles.container, {
            [styles.containerActive]: isItemToRemove,
        })}>
            {children}
            <div onClick={handleRemoveItem} className={styles.removeIcon}>-</div>
        </div>
    );
};

export default Editable;

import React, {useEffect, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import * as uiActions from 'store/actions/ui';

import cs from '@ra/cs';

import styles from './styles.scss';

const Toast = ({show, message}) => {
    const { toast } = useSelector(state => state.ui);

    const dispatch = useDispatch();
    const onClose = useCallback(() => {
        dispatch(uiActions.hideToast());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(onClose, toast.duration*1000);
        return () => {
            clearTimeout(timer);
        };

    }, [onClose, toast.duration]);

    if(!toast.visible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={cs(styles.content, toast.status)}>
                <IoMdClose className={styles.close} onClick={onClose} />
                {toast.message}
            </div>
        </div>
    );
};

export default Toast;

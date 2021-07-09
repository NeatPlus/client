import React, {useEffect, useCallback, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import {BiCheckCircle, BiInfoCircle} from 'react-icons/bi';
import {FiAlertTriangle} from 'react-icons/fi';

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

    const Icon = useMemo(() => {
        switch(toast.status) {
        case 'success':
            return BiCheckCircle;
        case 'danger':
            return FiAlertTriangle;
        default:
            return BiInfoCircle;
        }
    }, [toast]);

    if(!toast.visible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={cs(styles.content, toast.status)}>
                <Icon className={styles.icon} />
                <p className={styles.message}>
                    {toast.message} 
                </p>
                <div className={styles.closeContainer} onClick={onClose}>
                    <IoMdClose className={styles.close} />
                </div>
            </div>
        </div>
    );
};

export default Toast;

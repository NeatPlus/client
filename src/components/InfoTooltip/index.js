import React, {useCallback, useState, useRef, useEffect, useImperativeHandle, forwardRef} from 'react';
import {IoIosInformationCircle} from 'react-icons/io';

import cs from '@ra/cs';

import styles from './styles.scss';

const InfoTooltip = forwardRef(({
    icon: Icon = IoIosInformationCircle,
    message,
    iconClassName,
    iconSize=20,
    tooltipClassName,
    ...iconProps
}, ref) => {
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    
    const timeoutRef = useRef();
    const handleShowMessage = useCallback((timeMs = 2000) => {
        setIsMessageVisible(true);
        timeoutRef.current = setTimeout(() => {
            setIsMessageVisible(false);
        }, timeMs);
    }, []);

    useEffect(() => {
        return () => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useImperativeHandle(ref, () => {
        return {
            showMessage: handleShowMessage
        };
    }, [handleShowMessage]);

    return (
        <span className={styles.container}>
            <Icon className={cs(styles.icon, iconClassName, {
                [styles.iconVisible]: isMessageVisible
            })} size={iconSize} {...iconProps} />
            <div className={cs(styles.tooltipContent, tooltipClassName)}>
                {message}
            </div>
        </span>
    );
});

export default InfoTooltip;

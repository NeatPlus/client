import React from 'react';
import {IoIosInformationCircle} from 'react-icons/io';

import cs from '@ra/cs';

import styles from './styles.scss';

const InfoTooltip = ({
    icon: Icon = IoIosInformationCircle,
    message,
    iconClassName,
    iconSize=20,
    tooltipClassName
}) => {
    return (
        <span className={styles.container}>
            <Icon className={cs(styles.icon, iconClassName)} size={iconSize} />
            <div className={cs(styles.tooltipContent, tooltipClassName)}>
                {message}
            </div>
        </span>
    );
};

export default InfoTooltip;

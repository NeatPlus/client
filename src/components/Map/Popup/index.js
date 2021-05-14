import cs from '@ra/cs';

import styles from './styles.scss';

const DataItem = ({label, value}) => {
    return (
        <div className={styles.dataItem}>
            <p className={styles.dataItemLabel}>{label}</p>
            <p className={styles.dataItemValue}>{value}</p>
        </div>
    );
};

const Popup = ({className}) => {
    return(
        <div className={cs(styles.popup, className)}>
            <DataItem label="Project Name" value="Africa 2020" />
            <DataItem label="Organization" value="UNHCR" />
            <DataItem label="Submission Date" value="15/02/2021" />
        </div>
    );
};

export default Popup;

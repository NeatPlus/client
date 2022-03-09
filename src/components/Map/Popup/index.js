import cs from '@ra/cs';
import {_} from 'services/i18n';

import styles from './styles.scss';

const DataItem = ({label, value}) => {
    return (
        <div className={styles.dataItem}>
            <p className={styles.dataItemLabel}>{label}</p>
            <p className={styles.dataItemValue}>{value || ''}</p>
        </div>
    );
};

const Popup = ({className, project}) => {
    const projectDate = new Date(project?.createdAt);

    return(
        <div className={cs(styles.popup, className)}>
            <DataItem label={_('Project Name')} value={project?.title} />
            <DataItem label={_('Organization')} value={project?.organizationTitle} />
            {project?.createdAt && (
                <DataItem 
                    label={_('Submission Date')}
                    value={projectDate.toLocaleDateString()} 
                />
            )}
        </div>
    );
};

export default Popup;

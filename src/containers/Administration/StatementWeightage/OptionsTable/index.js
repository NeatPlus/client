import {useMemo} from 'react';

import WeightageInput from 'components/WeightageInput';
import Table from '@ra/components/Table';

import {_} from 'services/i18n';

import styles from './styles.scss';

const HeaderItem = ({column}) => {
    if(column.Header === _('Weightage')) {
        return (
            <div className={styles.weightageItem}>
                {column.Header}
            </div>
        );
    }
    return column.Header;
};

const DataItem = props => {
    const {item, index, column} = props;

    if(column.Header === _('Options')) {
        return (
            <div className={styles.nameItem}>
                {item?.[column.accessor]}
            </div>
        );
    }
    if(column.Header === _('S.N.')) {
        return `${index+1}.`;
    }
    if(column.Header === _('Weightage')) {
        return (
            <WeightageInput {...props} />
        );
    }
    return item?.[column.accessor] ?? '-';
};

const OptionsTable = props => {
    const {
        activeOptions,
        loading,
    } = props;

    const columns = useMemo(() => ([
        {
            Header: _('S.N.'),
            accessor: '',
        }, {
            Header: _('Options'),
            accessor: 'title',
        }, {
            Header: _('Weightage'),
            accessor: 'weightage',
        },
    ]), []);

    return (
        <div className={styles.optionsTableContainer}>
            <Table 
                loading={loading}
                className={styles.table} 
                data={activeOptions} 
                columns={columns} 
                maxRows={activeOptions?.length}
                renderDataItem={DataItem}
                renderHeaderItem={HeaderItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                bodyRowClassName={styles.bodyRow}
            />
        </div> 
    );
};

export default OptionsTable;

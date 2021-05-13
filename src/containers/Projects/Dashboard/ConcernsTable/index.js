import Table from '@ra/components/Table';
import concerns from 'services/mockData/concerns.json';
import cs from '@ra/cs';

import styles from './styles.scss';

const columns = [
    {
        Header: 'Topic',
        accessor: 'topic',
    }, 
    {
        Header: 'High',
        accessor: 'high',
    },
    {
        Header: 'Medium',
        accessor: 'medium',
    },
    {
        Header: 'Low',
        accessor: 'low',
    },
    {
        Header: 'Total',
        accessor: 'total',
    },
];

const HeaderItem = ({column}) => {
    if(column.Header==='High') {
        return <div className={cs(styles.header, styles.headerHigh)}>{column.Header}</div>;
    }
    if(column.Header==='Medium') {
        return <div className={cs(styles.header, styles.headerMedium)}>{column.Header}</div>;
    }
    if(column.Header==='Low') {
        return <div className={cs(styles.header, styles.headerLow)}>{column.Header}</div>;
    }
    return column.Header;
};

export const DataItem = ({item, column}) => {
    if(column.Header==='Topic') {
        return <span className={styles.nameItem}>{item[column.accessor]}</span>;
    }
    return item[column.accessor];
};

const ConcernsTable = ({onTakeSurveyClick}) => {
    return (
        <Table 
            className={styles.table} 
            data={concerns} 
            columns={columns} 
            renderHeaderItem={HeaderItem}
            renderDataItem={DataItem}
            headerClassName={styles.tableHeader}
            headerRowClassName={styles.headerRow}
            bodyClassName={styles.tableBody}
            bodyRowClassName={styles.bodyRow}
        /> 
    );
};

export default ConcernsTable;

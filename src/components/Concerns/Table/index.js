import SVG from 'react-inlinesvg';

import {NeatLoader} from 'components/Loader';

import Table from '@ra/components/Table';
import cs from '@ra/cs';

import topicIconPlaceholder from 'assets/icons/topic-icon-placeholder.svg';

import styles from './styles.scss';

const columns = [
    {
        Header: 'Topic',
        accessor: 'topic',
    }, 
    {
        Header: 'High',
        accessor: 'highCount',
    },
    {
        Header: 'Medium',
        accessor: 'mediumCount',
    },
    {
        Header: 'Low',
        accessor: 'lowCount',
    },
    {
        Header: 'Total',
        accessor: 'totalCount',
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
        return (
            <div className={styles.nameContainer}>
                <SVG 
                    className={styles.nameIcon}
                    src={item.icon ?? topicIconPlaceholder}
                    width={20} 
                    title={item[column.accessor]}
                />
                <span
                    className={styles.nameItem}
                    title={item[column.accessor]}
                >
                    {item[column.accessor]}
                </span>
            </div>
        );
    }
    return item[column.accessor];
};

const ConcernsTable = ({onTakeSurveyClick, concerns}) => {
    return (
        <Table 
            loading={!concerns?.length}
            LoadingComponent={<NeatLoader medium />}
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

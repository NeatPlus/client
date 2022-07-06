import {useMemo} from 'react';
import SVG from 'react-inlinesvg';

import {NeatLoader} from 'components/Loader';

import Table from '@ra/components/Table';
import cs from '@ra/cs';
import {_} from 'services/i18n';

import topicIconPlaceholder from 'assets/icons/topic-icon-placeholder.svg';

import styles from './styles.scss';


const HeaderItem = ({column}) => {
    if(column.Header===_('High')) {
        return <div className={cs(styles.header, styles.headerHigh)}>{column.Header}</div>;
    }
    if(column.Header===_('Medium')) {
        return <div className={cs(styles.header, styles.headerMedium)}>{column.Header}</div>;
    }
    if(column.Header===_('Low')) {
        return <div className={cs(styles.header, styles.headerLow)}>{column.Header}</div>;
    }
    return column.Header;
};

export const DataItem = ({item, column}) => {
    if(column.Header===_('Topic')) {
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
    const columns = useMemo(() => ([
        {
            Header: _('Topic'),
            accessor: 'topic',
        }, 
        {
            Header: _('High'),
            accessor: 'highCount',
        },
        {
            Header: _('Medium'),
            accessor: 'mediumCount',
        },
        {
            Header: _('Low'),
            accessor: 'lowCount',
        },
        {
            Header: _('Total'),
            accessor: 'totalCount',
        },
    ]), []);

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

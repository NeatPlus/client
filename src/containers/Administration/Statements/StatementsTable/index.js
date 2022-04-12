import {useMemo, useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {NeatLoader} from 'components/Loader';

import Table from '@ra/components/Table';
import SelectInput from '@ra/components/Form/SelectInput';
import {Localize} from '@ra/components/I18n';
import Pagination from '@ra/components/Pagination';

import {_} from 'services/i18n';

import styles from './styles.scss';

const keyExtractor = item => item.value;
const labelExtractor = item => item.label;

const maxRowsOptions = [
    {
        label: '10',
        value: 10,
    },
    {
        label: '20',
        value: 20,
    },
    {
        label: '50',
        value: 50,
    },
];

export const DataItem = ({item, column, onClone, onDelete}) => {
    if(column.Header===_('Title')) {
        return (
            <div className={styles.nameItem}>
                {item[column.accessor]}
            </div>
        );
    }
    return item?.[column.accessor] ?? '-';
};


const StatementsTable = props => {
    const {statements, status} = useSelector(state => state.statement);

    const totalStatements = useMemo(() => statements?.length, [statements]);

    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback(({option}) => setMaxRows(option), []);

    const columns = useMemo(() => ([
        {
            Header: _('Title'),
            accessor: 'title',
        }, {
            Header: _('Variance'),
            accessor: '',
        },  {
            Header: _('Sum of squares'),
            accessor: '',
        }, {
            Header: _('Difference'),
            accessor: '',
        }, {
            Header: _('Okay / Need Correction'),
            accessor: '',
        }
    ]), []); 

    const history = useHistory();

    const handleRowClick = useCallback(statement => {
        history.push(`/administration/statements/${statement.id}/`);
    }, [history]);

    const renderDataItem = useCallback(otherProps => (
        <DataItem {...otherProps} />
    ), []);

    return (
        <div className={styles.content}>
            <Table 
                loading={status!=='complete'}
                LoadingComponent={<NeatLoader medium />}
                className={styles.table} 
                data={statements} 
                columns={columns} 
                maxRows={maxRows.value}
                page={page}
                renderDataItem={renderDataItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                bodyRowClassName={styles.bodyRow}
                onRowClick={handleRowClick}
            />
            <div className={styles.contentFooter}>
                <div className={styles.maxRowsSelect}>
                    <Localize>Show</Localize>
                    <SelectInput 
                        className={styles.select}
                        controlClassName={styles.selectControl}
                        options={maxRowsOptions} 
                        keyExtractor={keyExtractor} 
                        valueExtractor={labelExtractor} 
                        onChange={handleMaxRowsChange}
                        value={maxRows}
                        defaultValue={maxRowsOptions[0]}
                        clearable={false}
                        searchable={false}
                        optionsDirection="up"
                    />
                    <Localize>Rows</Localize>
                </div>
                <Pagination 
                    className={styles.pagination}
                    pageItemClassName={styles.paginationItem}
                    activePageItemClassName={styles.paginationItemActive}
                    onChange={handlePageChange} 
                    totalRecords={totalStatements}
                    pageNeighbours={1}
                    pageLimit={maxRows.value} 
                    pageNum={page}
                />
            </div>
        </div>
    );
};

export default StatementsTable;

import {useMemo, useCallback, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {NeatLoader} from 'components/Loader';

import Table from '@ra/components/Table';
import SelectInput from '@ra/components/Form/SelectInput';
import {Localize} from '@ra/components/I18n';
import Pagination from '@ra/components/Pagination';

import Api from 'services/api';
import {_} from 'services/i18n';
import usePromise from '@ra/hooks/usePromise';

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
    {
        label: '100',
        value: 100,
    }
];

export const DataItem = ({item, column, contextId, moduleId}) => {
    if(column.Header === _('Title')) {
        return (
            <div className={styles.nameItem}>
                {item[column.accessor]}
            </div>
        );
    }
    if(column.Header === _('Okay / Need correction')) {
        if(item.sumOfSquare <= 0.2) {
            return _('Okay');
        }
        if(item.standardDeviation <= 0.2 && item.sumOfSquare > 0.2) {
            return _('May need correction');
        }
        if(item.standardDeviation > 0.2 && item.sumOfSquare > 0.2) {
            return _('Need correction');
        }
        return '-';
    }
    return item?.[column.accessor] ?? '-';
};

const StatementsTable = props => {
    const {activeContext, activeModule} = props;

    const {statements, status} = useSelector(state => state.statement);

    const totalStatements = useMemo(() => statements?.length, [statements]);

    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[maxRowsOptions.length - 1]);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback(({option}) => {
        setPage(1);
        setMaxRows(option);
    }, []);

    const [{result: insightsResult}, loadInsights] = usePromise(Api.getInsights);

    const columns = useMemo(() => ([
        {
            Header: _('Title'),
            accessor: 'title',
        }, {
            Header: _('Standard deviation'),
            accessor: 'standardDeviation',
        },  {
            Header: _('Sum of squares'),
            accessor: 'sumOfSquare',
        }, {
            Header: _('Difference'),
            accessor: 'difference',
        }, {
            Header: _('Okay / Need correction'),
            accessor: '',
        }
    ]), []); 

    useEffect(() => {
        if(activeModule?.id) {
            loadInsights({module: activeModule.id});
        }
    }, [loadInsights, activeModule]);

    const statementData = useMemo(() => {
        if(!insightsResult?.length > 0) {
            return statements;
        }
        return statements.map(st => {
            const statementInsight = insightsResult.find(res => res.statement === st.id);
            const difference = statementInsight?.difference;
            const sumOfSquare = statementInsight?.sumOfSquare;
            const standardDeviation = statementInsight?.standardDeviation;
            return {
                ...st,
                difference: Math.abs(Number(difference)).toFixed(2),
                sumOfSquare: Number(sumOfSquare).toFixed(2),
                standardDeviation: Number(standardDeviation).toFixed(2),
            };
        });
    }, [statements, insightsResult]);

    const navigate = useNavigate();

    const handleRowClick = useCallback(statement => {
        navigate(`/administration/statements/${statement.id}/`);
    }, [navigate]);

    const renderDataItem = useCallback(otherProps => (
        <DataItem contextId={activeContext?.id} moduleId={activeModule?.id} {...otherProps} />
    ), [activeContext, activeModule]);

    return (
        <div className={styles.content}>
            <Table
                loading={status!=='complete'}
                LoadingComponent={<NeatLoader medium />}
                EmptyComponent={<p className={styles.statusMessage}>
                    <Localize>No statements found. Please wait...</Localize>
                </p>}
                className={styles.table}
                data={statementData}
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
                        defaultValue={maxRowsOptions[maxRowsOptions.length - 1]}
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

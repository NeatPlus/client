import {useState, useCallback} from 'react';
import {Link} from 'react-router-dom';

import OptionsDropdown from 'components/OptionsDropdown';
import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';

import surveys from 'services/mockData/surveys.json';

import styles from './styles.scss';

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    }, 
    {
        Header: 'Location',
        accessor: 'location',
    },
    {
        Header: 'Surveyed by',
        accessor: 'surveyed_by',
    },
    {
        Header: 'Created on',
        accessor: 'created_on',
    },
    {
        Header: 'Modified on',
        accessor: 'modified_on',
    },
    {
        Header: 'Options',
        accessor: '',
    },
];

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

const keyExtractor = item => item.value;
const labelExtractor = item => item.label;

const HeaderItem = ({column}) => {
    if(column.Header==='Options') {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column}) => {
    const handleEditClick = useCallback(() => {
        // TODO: Edit Survey Functionality
    }, []);

    const handleDeleteClick = useCallback(() => {
        // TODO: Delete Survey Functionality
    }, []);

    if(column.Header==='Name') {
        return <Link to={`${item.id}/`} className={styles.nameItem}>{item[column.accessor]}</Link>;
    }
    if(column.Header==='Options') {
        return (
            <OptionsDropdown className={styles.optionsItem} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        );
    }
    return item[column.accessor];
};


const SurveyList = () => {
    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback((item) => setMaxRows(item), []);

    return (
        <div class={styles.container}>
            <Table 
                className={styles.table} 
                data={surveys} 
                columns={columns} 
                maxRows={maxRows.value}
                page={page}
                renderHeaderItem={HeaderItem} 
                renderDataItem={DataItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                bodyRowClassName={styles.bodyRow}
            />
            <div className={styles.contentFooter}>
                <div className={styles.maxRowsSelect}>
                    Show 
                    <SelectInput 
                        className={styles.select}
                        controlClassName={styles.selectControl}
                        options={maxRowsOptions} 
                        keyExtractor={keyExtractor} 
                        valueExtractor={labelExtractor} 
                        onChange={handleMaxRowsChange}
                        defaultValue={maxRows}
                        clearable={false}
                        searchable={false}
                    />
                    Rows
                </div>
                <Pagination 
                    className={styles.pagination}
                    pageItemClassName={styles.paginationItem}
                    activePageItemClassName={styles.paginationItemActive}
                    onChange={handlePageChange} 
                    totalRecords={surveys.length}
                    pageNeighbours={1}
                    pageLimit={maxRows.value} 
                    pageNum={page}
                />
            </div>
        </div>
    );
};

export default SurveyList;

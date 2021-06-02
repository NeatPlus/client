import {useState, useCallback} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import OptionsDropdown from 'components/OptionsDropdown';
import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';

import {getFormattedSurveys} from 'store/selectors/survey';

import styles from './styles.scss';

const columns = [
    {
        Header: 'Name',
        accessor: 'title',
    }, 
    {
        Header: 'Location',
        accessor: 'location',
    },
    {
        Header: 'Surveyed by',
        accessor: 'createdBy',
    },
    {
        Header: 'Created on',
        accessor: 'createdAt',
    },
    {
        Header: 'Modified on',
        accessor: 'modifiedAt',
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
    if(column.Header==='Created on' || column.Header==='Modified on') {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if(column.Header==='Surveyed by') {
        return item[column.accessor].firstName + ' ' + item[column.accessor].lastName;
    }
    if(column.Header==='Options') {
        return (
            <OptionsDropdown className={styles.optionsItem} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        );
    }
    return item[column.accessor];
};


const SurveyList = () => {
    const {projectId} = useParams();

    const surveys = useSelector(state => getFormattedSurveys(state));
    const surveyData = surveys.filter(el => el.project === +projectId);

    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback((item) => setMaxRows(item), []);

    return (
        <div class={styles.container}>
            <Table 
                className={styles.table} 
                data={surveyData} 
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
                        optionsDirection="up"
                    />
                    Rows
                </div>
                <Pagination 
                    className={styles.pagination}
                    pageItemClassName={styles.paginationItem}
                    activePageItemClassName={styles.paginationItemActive}
                    onChange={handlePageChange} 
                    totalRecords={surveyData.length}
                    pageNeighbours={1}
                    pageLimit={maxRows.value} 
                    pageNum={page}
                />
            </div>
        </div>
    );
};

export default SurveyList;

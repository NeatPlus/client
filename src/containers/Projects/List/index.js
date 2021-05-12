import {useState, useCallback} from 'react';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import {withNoProject} from 'components/NoProject';
import CreateProjectModal from 'components/CreateProjectModal';
import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';

import projects from 'services/mockData/projects';

import {HeaderItem, DataItem} from './TableItems';

import styles from './styles.scss';

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    }, {
        Header: 'Organization',
        accessor: 'organization',
    }, {
        Header: 'Created on',
        accessor: 'created_on',
    }, {
        Header: 'Visibility',
        accessor: 'visibility',
    }, {
        Header: 'Submissions',
        accessor: 'submissions',
    }, {
        Header: 'Options',
        accessor: '',
    }
]; 

const maxRowsOptions = [
    {
        label: '2',
        value: 2,
    },
    {
        label: '3',
        value: 3,
    },
    {
        label: '10',
        value: 10,
    },
];

const keyExtractor = item => item.value;
const labelExtractor = item => item.label;

const ProjectList = withNoProject(() => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const handleShowCreateModal = useCallback(() => setShowCreateModal(true), []);
    const handleHideCreateModal = useCallback(() => setShowCreateModal(false), []);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback((item) => setMaxRows(item), []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Projects</h1>
                <Button className={styles.button} onClick={handleShowCreateModal}>
                    <BsPlus size={24} className={styles.buttonIcon} /> Create
                </Button>
            </div>
            <div className={styles.content}>
                <Table 
                    className={styles.table} 
                    data={projects} 
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
                        totalRecords={projects.length}
                        pageNeighbours={1}
                        pageLimit={maxRows.value} 
                        pageNum={page}
                    />
                </div>
            </div>
            <CreateProjectModal isVisible={showCreateModal} onClose={handleHideCreateModal} />
        </div>
    );
});

export default ProjectList;

import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';

import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import {withNoProject} from 'components/NoProject';
import CreateEditProjectModal from 'components/CreateEditProjectModal';
import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';

import {HeaderItem, DataItem} from './TableItems';
import {getFormattedProjects} from 'store/selectors/project';

import styles from './styles.scss';

const columns = [
    {
        Header: 'Name',
        accessor: 'title',
    },
    {
        Header: 'Organization',
        accessor: 'organization',
    },
    {
        Header: 'Created on',
        accessor: 'createdAt',
    },
    {
        Header: 'Visibility',
        accessor: 'visibility',
    },
    {
        Header: 'Submissions',
        accessor: 'submissions',
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

const keyExtractor = (item) => item.value;
const labelExtractor = (item) => item.label;

const ProjectList = withNoProject(({searchedProject, searchedText}) => {
    const projects = useSelector(getFormattedProjects);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const handleShowCreateModal = useCallback(
        () => setShowCreateModal(true),
        []
    );
    const handleHideCreateModal = useCallback(
        () => setShowCreateModal(false),
        []
    );

    const handlePageChange = useCallback(
        ({currentPage}) => setPage(currentPage),
        []
    );
    const handleMaxRowsChange = useCallback(
        ({option}) => setMaxRows(option),
        []
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Projects</h1>
                <Button
                    className={styles.button}
                    onClick={handleShowCreateModal}
                >
                    <BsPlus size={24} className={styles.buttonIcon} /> Create
                </Button>
            </div>
            <div className={styles.content}>
                <Table
                    className={styles.table}
                    data={searchedText.length ? searchedProject : projects}
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
                            defaultValue={maxRowsOptions[0]}
                            clearable={false}
                            searchable={false}
                            optionsDirection='up'
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
            <CreateEditProjectModal
                isVisible={showCreateModal}
                onClose={handleHideCreateModal}
                mode='create'
            />
        </div>
    );
});

export default ProjectList;

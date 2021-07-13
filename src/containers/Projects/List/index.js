import {useState, useCallback, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import {withNoProject} from 'components/NoProject';
import CreateEditProjectModal from 'components/CreateEditProjectModal';
import Tabs, {Tab} from 'components/Tabs';

import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';

import {getFormattedProjects} from 'store/selectors/project';

import {HeaderItem, DataItem} from './TableItems';

import styles from './styles.scss';

const columns = [
    {
        Header: 'Name',
        accessor: 'title',
    }, {
        Header: 'Organization',
        accessor: 'organization',
    }, {
        Header: 'Created on',
        accessor: 'createdAt',
    }, {
        Header: 'Visibility',
        accessor: 'visibility',
    }, {
        Header: 'Surveys',
        accessor: 'surveys',
    }, {
        Header: 'Options',
        accessor: '',
    }
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

const Projects = ({data: projects}) => {
    const history = useHistory();

    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback(({option}) => setMaxRows(option), []);

    const handleRowClick = useCallback(project => {
        history.push(`/projects/${project.id}/`); 
    }, [history]);

    return (
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
                onRowClick={handleRowClick}
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
                        optionsDirection="up"
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
    );
};

const ProjectList = withNoProject(() => {
    const projects = useSelector(getFormattedProjects);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const handleShowCreateModal = useCallback(() => setShowCreateModal(true), []);
    const handleHideCreateModal = useCallback(() => setShowCreateModal(false), []);

    const renderTitle = useCallback(() => (
        <h1 className={styles.title}>
            Projects
        </h1>
    ), []);

    const renderCreateButton = useCallback(() => (
        <Button 
            outline 
            className={styles.button} 
            onClick={handleShowCreateModal}
        >
            <BsPlus size={24} className={styles.buttonIcon} /> Create
        </Button>
    ), [handleShowCreateModal]);

    const publicProjects = useMemo(() => projects.filter(prj => {
        return prj.visibility === 'public';
    }), [projects]);
    const organizationProjects = useMemo(() => projects.filter(prj => {
        return prj.isAdminOrOwner;
    }), [projects]);

    return (
        <div className={styles.container}>
            <Tabs 
                secondary
                renderPreHeaderComponent={renderTitle}
                renderPostHeaderComponent={renderCreateButton}
                headerContainerClassName={styles.headerContainer}
                headerClassName={styles.tabsHeader}
                tabItemClassName={styles.headerItem}
            >
                <Tab label="my_projects" title="My Projects">
                    <Projects data={projects} />
                </Tab>
                <Tab label="my_organizations" title="My Organizations">
                    <Projects data={organizationProjects} />
                </Tab>
                <Tab label="public" title="Public">
                    <Projects data={publicProjects} />
                </Tab>
            </Tabs>
            <CreateEditProjectModal
                isVisible={showCreateModal}
                onClose={handleHideCreateModal}
                mode='create'
            />
        </div>
    );
});

export default ProjectList;

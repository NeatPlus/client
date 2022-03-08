import {useState, useCallback, useMemo, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {BsPlus} from 'react-icons/bs';

import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import {withNoProject} from 'components/NoProject';
import CreateEditProjectModal from 'components/CreateEditProjectModal';
import Tabs, {Tab} from 'components/Tabs';

import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import Api from 'services/api';
import usePromise from '@ra/hooks/usePromise';

import {HeaderItem, DataItem} from './TableItems';

import styles from './styles.scss';

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

const tabs = [
    {
        label: 'my_project',
        title: 'My Projects',
    },
    {
        label: 'organization',
        title: 'My Organizations',
    },
    {
        label: 'public',
        title: 'Public',
    },
];

const keyExtractor = item => item.value;
const labelExtractor = item => item.label;

const ProjectTable = withNoProject(props => {
    const {
        loading,
        projects, 
        page, 
        maxRows, 
        setPage, 
        setMaxRows,
        totalProjects,
        onAction,
    } = props;

    const columns = useMemo(() => ([
        {
            Header: _('Name'),
            accessor: 'title',
        }, {
            Header: _('Organization'),
            accessor: 'organizationTitle',
        },  {
            Header: _('Created by'),
            accessor: 'createdBy',
        }, {
            Header: _('Created on'),
            accessor: 'createdAt',
        }, {
            Header: _('Visibility'),
            accessor: 'visibility',
        }, {
            Header: _('Surveys'),
            accessor: 'surveys',
        }, {
            Header: _('Options'),
            accessor: '',
        }
    ]), []); 

    const history = useHistory();

    const handlePageChange = useCallback(({currentPage}) => {
        setPage(currentPage);
    }, [setPage]);
    const handleMaxRowsChange = useCallback(({option}) => {
        setMaxRows(option);
    }, [setMaxRows]);

    const handleRowClick = useCallback(project => {
        history.push(`/projects/${project.id}/`); 
    }, [history]);

    const renderDataItem = useCallback(otherProps => (
        <DataItem {...otherProps} onAction={onAction} />
    ), [onAction]);

    return (
        <div className={styles.content}>
            <Table 
                controlled
                loading={loading}
                LoadingComponent={<NeatLoader medium />}
                className={styles.table} 
                data={projects} 
                columns={columns} 
                maxRows={maxRows.value}
                page={page}
                renderHeaderItem={HeaderItem} 
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
                    totalRecords={totalProjects}
                    pageNeighbours={1}
                    pageLimit={maxRows.value} 
                    pageNum={page}
                />
            </div>
        </div>
    );
});

const ProjectList = () => {
    const [{loading, result}, getProjects] = usePromise(Api.getProjects);

    const totalProjects = useMemo(() => result?.count || 0, [result]);
    const projects = useMemo(() => result?.results || [], [result]);
    
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);
    
    const initialPageValue = useMemo(() => {
        if(!result?.previous) {
            return 1;
        }
        const searchParams = new URLSearchParams(result.previous);
        const offset = searchParams.get('offset');
        if(!offset) {
            return 2;
        }
        return Math.floor(offset / maxRows.value);
    }, [result, maxRows]);

    const [tab, setTab] = useState(tabs[0].label);
    const [page, setPage] = useState(initialPageValue);

    const fetchProjects = useCallback(() => {
        getProjects({
            tab,
            limit: maxRows.value, 
            offset: (page - 1) * maxRows.value,
        });
    }, [getProjects, page, maxRows, tab]); 

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleTabChange = useCallback(({activeTab}) => {
        setPage(1);
        setTab(activeTab);
    }, []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const handleShowCreateModal = useCallback(() => setShowCreateModal(true), []);
    const handleHideCreateModal = useCallback(() => setShowCreateModal(false), []);

    const renderTitle = useCallback(() => (
        <h1 className={styles.title}>
            <Localize>Projects</Localize>
        </h1>
    ), []);

    const renderCreateButton = useCallback(() => (
        <Button 
            outline 
            className={styles.button} 
            onClick={handleShowCreateModal}
        >
            <BsPlus size={24} className={styles.buttonIcon} /> <Localize>Create</Localize>
        </Button>
    ), [handleShowCreateModal]);

    return (
        <div className={styles.container}>
            <Tabs 
                activeTab={tab}
                secondary
                PreHeaderComponent={renderTitle}
                PostHeaderComponent={renderCreateButton}
                headerContainerClassName={styles.headerContainer}
                headerClassName={styles.tabsHeader}
                tabItemClassName={styles.headerItem}
                onChange={handleTabChange}
            >
                {tabs.map(tabItem => (
                    <Tab 
                        key={tabItem.label} 
                        label={tabItem.label} 
                        title={tabItem.title}
                    >
                        <ProjectTable 
                            loading={loading}
                            page={page} 
                            maxRows={maxRows} 
                            projects={projects} 
                            setPage={setPage}
                            setMaxRows={setMaxRows}
                            totalProjects={totalProjects}
                            onAction={fetchProjects}
                        />
                    </Tab>
                ))}
            </Tabs>
            <CreateEditProjectModal
                isVisible={showCreateModal}
                onClose={handleHideCreateModal}
                mode='create'
            />
        </div>
    );
};

export default ProjectList;

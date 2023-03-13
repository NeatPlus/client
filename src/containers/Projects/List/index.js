import {useState, useCallback, useMemo, useEffect} from 'react';
import {useNavigate, useOutletContext} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {BsPlus} from 'react-icons/bs';

import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import {withNoProject} from 'components/NoProject';
import CreateEditProjectModal from 'components/CreateEditProjectModal';
import Tabs, {Tab} from 'components/Tabs';

import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

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

    const {surveys} = useSelector(state => state.survey);

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

    const navigate = useNavigate();

    const handlePageChange = useCallback(({currentPage}) => {
        localStorage.setItem('projectsPage', currentPage);
        setPage(currentPage);
    }, [setPage]);
    const handleMaxRowsChange = useCallback(({option}) => {
        localStorage.setItem('projectsPage', 1);
        setPage(1);
        localStorage.setItem('projectsRows', option.label);
        setMaxRows(option);
    }, [setMaxRows, setPage]);

    const handleRowClick = useCallback(project => {
        const projectSurveys = surveys.filter(srv => srv.project === project.id);
        if(project.surveysCount !== projectSurveys.length) {
            Api.getSurveys({project: project.id});
        }
        navigate(`/projects/${project.id}/`, {state: {project}}); 
    }, [navigate, surveys]);

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
    const {projectSearchQuery} = useOutletContext();

    const [{loading, result}, getProjects] = usePromise(Api.getProjects);

    const totalProjects = useMemo(() => result?.count || 0, [result]);
    const projects = useMemo(() => result?.results || [], [result]);

    const tabs = useMemo(() => ([
        {
            label: 'my_project',
            title: _('My Projects'),
        },
        {
            label: 'organization',
            title: _('My Organizations'),
        },
        {
            label: 'public',
            title: _('Public'),
        }
    ]), []);

    const initialMaxRows = useMemo(() => {
        if(maxRowsOptions.map(opt => opt.label).includes(localStorage.getItem('projectsRows'))) {
            return maxRowsOptions.find(opt => {
                return opt.label === localStorage.getItem('projectsRows');
            }) || maxRowsOptions[0];
        }
        return maxRowsOptions[0];
    }, []);

    const [maxRows, setMaxRows] = useState(initialMaxRows);

    const initialPageValue = useMemo(() => {
        if(!isNaN(localStorage.getItem('projectsPage'))) {
            return Number(localStorage.getItem('projectsPage'));
        }
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

    const initialTab = useMemo(() => {
        if(tabs.map(tb => tb.label).includes(localStorage.getItem('activeProjectsTab'))) {
            return localStorage.getItem('activeProjectsTab');
        }
        return tabs[0].label;
    }, [tabs]);

    const [tab, setTab] = useState(initialTab);
    const [page, setPage] = useState(initialPageValue);

    const fetchProjects = useCallback(() => {
        getProjects({
            tab,
            limit: maxRows.value, 
            offset: (page - 1) * maxRows.value,
            search: projectSearchQuery
        });
    }, [getProjects, page, maxRows, tab, projectSearchQuery]); 

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        const pageFromStorage = localStorage.getItem('projectsPage');
        if(Number(pageFromStorage !== page)) {
            setPage(Number(pageFromStorage));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectSearchQuery]);

    const handleTabChange = useCallback(({activeTab}) => {
        localStorage.setItem('projectsPage', 1);
        setPage(1);
        localStorage.setItem('activeProjectsTab', activeTab);
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
                onComplete={fetchProjects}
                mode='create'
            />
        </div>
    );
};

export default ProjectList;

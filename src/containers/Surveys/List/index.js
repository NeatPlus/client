import {useState, useCallback, useMemo} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import OptionsDropdown from 'components/OptionsDropdown';
import TakeSurveyModal from 'components/TakeSurveyModal';
import DeleteSurveyModal from 'components/DeleteSurveyModal';
import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';

import {checkEditAccess} from 'utils/permission';
import * as questionActions from 'store/actions/question';
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

export const DataItem = ({item, column, onClone, onDelete}) => {
    const {activeProject} = useSelector(state => state.project);
    
    const handleDeleteClick = useCallback(() => {
        onDelete && onDelete(item);
    }, [item, onDelete]);
    const handleCloneClick = useCallback(() => {
        onClone && onClone(item);
    }, [onClone, item]);

    const stopEventBubbling = useCallback(e => e.stopPropagation(), []);
    
    const hasEditAccess = useMemo(() => 
        checkEditAccess(activeProject?.accessLevel), 
    [activeProject]);

    if(column.Header==='Name') {
        return (
            <div className={styles.nameItem}>
                {item[column.accessor]}
            </div>
        );
    }
    if(column.Header==='Location') {
        const answer = item?.answers?.find(ans => ans.question.code === 'place')?.answer;
        return answer || '';
    }
    if(column.Header==='Created on' || column.Header==='Modified on') {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if(column.Header==='Surveyed by') {
        const answer = item?.answers?.find(ans => ans.question.code === 'usrname')?.answer;
        return answer || '';
    }
    if(column.Header==='Options') {
        if(!hasEditAccess) {
            return null;
        }
        return (
            <div onClick={stopEventBubbling}>
                <OptionsDropdown 
                    className={styles.optionsItem} 
                    onClone={handleCloneClick} 
                    onDelete={handleDeleteClick} 
                />
            </div>
        );
    }
    return item[column.accessor];
};


const SurveyList = () => {
    const {projectId} = useParams();
    const history = useHistory();

    const dispatch = useDispatch();

    const surveys = useSelector(state => getFormattedSurveys(state));
    const surveyData = surveys.filter(el => el.project === +projectId);

    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const [activeSurveyId, setActiveSurveyId] = useState(null);

    const hideSurveyModal = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowSurveyModal(false);
    }, [dispatch]);
    const hideDeleteSurveyModal = useCallback(() => {
        setShowDeleteModal(false);
    }, []);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback(({option}) => setMaxRows(option), []);

    const handleRowClick = useCallback(survey => {
        history.push(`${survey.id}/`);
    }, [history]);

    const handleCloneClick = useCallback((survey) => {
        dispatch(questionActions.setAnswers(survey.answers.map(sur => (
            {...sur, question: sur.question.id}
        ))));
        setShowSurveyModal(true);
    }, [dispatch]);

    const handleDeleteClick = useCallback((survey) => {
        setActiveSurveyId(survey.id);
        setShowDeleteModal(true);
    }, []);

    const renderDataItem = useCallback(tableProps => (
        <DataItem 
            onClone={handleCloneClick} 
            onDelete={handleDeleteClick} 
            {...tableProps} 
        />
    ), [handleCloneClick, handleDeleteClick]);

    return (
        <div className={styles.container}>
            <Table 
                className={styles.table} 
                data={surveyData} 
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
                    totalRecords={surveyData.length}
                    pageNeighbours={1}
                    pageLimit={maxRows.value} 
                    pageNum={page}
                />
            </div>
            <TakeSurveyModal 
                clone
                isVisible={showSurveyModal} 
                onClose={hideSurveyModal} 
            />
            <DeleteSurveyModal
                surveyId={activeSurveyId}
                onClose={hideDeleteSurveyModal}
                isVisible={showDeleteModal}
            />
        </div>
    );
};

export default SurveyList;

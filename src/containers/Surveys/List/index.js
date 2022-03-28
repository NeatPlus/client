import {useState, useCallback, useMemo} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {NeatLoader} from 'components/Loader';
import OptionsDropdown from 'components/OptionsDropdown';
import TakeSurveyModal from 'components/TakeSurveyModal';
import DeleteSurveyModal from 'components/DeleteSurveyModal';
import DeleteDraftModal from 'components/DeleteDraftModal';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import Table from '@ra/components/Table';
import Pagination from '@ra/components/Pagination';
import SelectInput from '@ra/components/Form/SelectInput';

import {initDraftAnswers} from 'utils/dispatch';
import {checkEditAccess} from 'utils/permission';
import * as questionActions from 'store/actions/question';
import {getFormattedSurveys} from 'store/selectors/survey';

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

const HeaderItem = ({column}) => {
    if(column.Header===_('Options')) {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column, onClone, onDelete}) => {
    const {projectId} = useParams();

    const dispatch = useDispatch();

    const {activeProject} = useSelector(state => state.project);
    const {projectId: draftId, title} = useSelector(state => state.draft);
    const {questions} = useSelector(state => state.question);
    
    const doesDraftExist = useMemo(() => draftId && title, [draftId, title]);
    const itemAnswers = useMemo(() => item.answers.map(sur => (
        {...sur, question: sur.question.id}
    )), [item]);

    const stopEventBubbling = useCallback(e => e.stopPropagation(), []);

    const hasEditAccess = useMemo(() => 
        checkEditAccess(activeProject?.accessLevel), 
    [activeProject]);

    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false);

    const handleShowDeleteSurveyModal= useCallback((survey) => {
        setShowDeleteModal(true);
    }, []);
    const hideDeleteSurveyModal = useCallback(() => {
        setShowDeleteModal(false);
    }, []);


    const handleShowSurveyModal = useCallback(() => {
        dispatch(questionActions.setAnswers(itemAnswers.filter(ans => {
            return questions['sens'].some(ques => ques.id === ans.question);
        })));
        initDraftAnswers(+projectId);
        setShowSurveyModal(true);
    }, [dispatch, projectId, itemAnswers, questions]);
    const hideSurveyModal = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowSurveyModal(false);
    }, [dispatch]);

    const handleShowDeleteDraftModal = useCallback((survey) => {
        if(doesDraftExist) {
            return setShowDeleteDraftModal(true);
        }
        handleShowSurveyModal();
    }, [handleShowSurveyModal, doesDraftExist]);
    const handleHideDeleteDraftModal = useCallback(() => {
        setShowDeleteDraftModal(false);
    }, []);

    if(column.Header===_('Name')) {
        return (
            <div className={styles.nameItem}>
                {item[column.accessor]}
            </div>
        );
    }
    if(column.Header===_('Location')) {
        const answer = item?.answers?.find(ans => ans.question.code === 'place')?.answer;
        return answer || '';
    }
    if(column.Header===_('Created on') || column.Header===_('Modified on')) {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if(column.Header===_('Surveyed by')) {
        const answer = item?.answers?.find(ans => ans.question.code === 'usrname')?.answer;
        return answer || '';
    }
    if(column.Header===_('Options')) {
        if(!hasEditAccess) {
            return null;
        }
        return (
            <div onClick={stopEventBubbling}>
                <OptionsDropdown 
                    className={styles.optionsItem} 
                    onClone={handleShowDeleteDraftModal} 
                    onDelete={handleShowDeleteSurveyModal} 
                />
                <TakeSurveyModal 
                    clone
                    isVisible={showSurveyModal} 
                    onClose={hideSurveyModal} 
                />
                <DeleteSurveyModal
                    surveyId={item.id}
                    onClose={hideDeleteSurveyModal}
                    isVisible={showDeleteModal}
                />
                <DeleteDraftModal
                    isVisible={showDeleteDraftModal}
                    onClose={handleHideDeleteDraftModal}
                    onDelete={handleShowSurveyModal}
                />
            </div>
        );
    }
    return item[column.accessor];
};


const SurveyList = () => {
    const columns = useMemo(() => ([
        {
            Header: _('Name'),
            accessor: 'title',
        }, 
        {
            Header: _('Location'),
            accessor: 'location',
        },
        {
            Header: _('Surveyed by'),
            accessor: 'createdBy',
        },
        {
            Header: _('Created on'),
            accessor: 'createdAt',
        },
        {
            Header: _('Modified on'),
            accessor: 'modifiedAt',
        },
        {
            Header: _('Options'),
            accessor: '',
        },
    ]), []);

    const {projectId} = useParams();
    const history = useHistory();

    const surveys = useSelector(state => getFormattedSurveys(state));
    const surveyData = surveys.filter(el => el.project === +projectId);

    const [page, setPage] = useState(1);
    const [maxRows, setMaxRows] = useState(maxRowsOptions[0]);

    const handlePageChange = useCallback(({currentPage}) => setPage(currentPage), []);
    const handleMaxRowsChange = useCallback(({option}) => setMaxRows(option), []);

    const handleRowClick = useCallback(survey => {
        history.push(`${survey.id}/`);
    }, [history]);

    return (
        <div className={styles.container}>
            <Table 
                className={styles.table} 
                data={surveyData} 
                columns={columns} 
                maxRows={maxRows.value}
                loading={!surveyData?.length}
                LoadingComponent={<NeatLoader medium />}
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
                    <Localize>Show</Localize> 
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
                    <Localize>Rows</Localize>
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

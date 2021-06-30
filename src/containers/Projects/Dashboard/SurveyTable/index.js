import {useCallback, useState, useMemo} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {BsPlus, BsArrowRight} from 'react-icons/bs';

import Button from 'components/Button';
import OptionsDropdown from 'components/OptionsDropdown';
import TakeSurveyModal from 'components/TakeSurveyModal';
import DeleteSurveyModal from 'components/DeleteSurveyModal';
import Table from '@ra/components/Table';

import {checkEditAccess} from 'utils/permission';
import * as questionActions from 'store/actions/question';
import {getFormattedSurveys} from 'store/selectors/survey';

import styles from './styles.scss';

const surveyColumns = [
    {
        Header: 'Name',
        accessor: 'title',
    }, 
    {
        Header: 'Created on',
        accessor: 'createdAt',
    },
    {
        Header: 'Options',
        accessor: '',
    },
];

const HeaderItem = ({column}) => {
    if(column.Header==='Options') {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column, onClone, onDelete}) => {
    const {activeProject} = useSelector(state => state.project);

    const handleCloneClick = useCallback(() => {
        onClone && onClone(item);
    }, [item, onClone]);

    const handleDeleteClick = useCallback(() => {
        onDelete && onDelete(item);
    }, [item, onDelete]);

    const stopEventBubbling = useCallback(e => e.stopPropagation(), []);

    const hasEditAccess = useMemo(() => 
        checkEditAccess(activeProject?.accessLevel), 
    [activeProject]);

    if(column.Header==='Name') {
        return <div className={styles.nameItem}>{item[column.accessor]}</div>;
    }
    if(column.Header==='Created on') {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if(column.Header==='Options') {
        if(!hasEditAccess) {
            return null;
        }
        return (
            <div onClick={stopEventBubbling}>
                <OptionsDropdown 
                    onClone={handleCloneClick} 
                    onDelete={handleDeleteClick} 
                />
            </div>
        );
    }
    return item[column.accessor];
};

const SurveyTable = ({onTakeSurveyClick}) => {
    const {projectId} = useParams();
    const history = useHistory();

    const dispatch = useDispatch();

    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [activeSurveyId, setActiveSurveyId] = useState(null);

    const handleCloneSurvey = useCallback(survey => {
        dispatch(questionActions.setAnswers(survey.answers.map(sur => (
            {...sur, question: sur.question.id}
        ))));
        setShowSurveyModal(true);
    }, [dispatch]);
    
    const hideSurveyModal = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowSurveyModal(false);
    }, [dispatch]);
    const hideDeleteSurveyModal = useCallback(() => {
        setShowDeleteModal(false);
    }, []);

    const {activeProject} = useSelector(state => state.project);
    const surveys = useSelector(getFormattedSurveys);
    const surveyData = surveys.filter(el => el.project === +projectId);

    const hasEditAccess = useMemo(() => 
        checkEditAccess(activeProject?.accessLevel), 
    [activeProject]);

    const handleMoreClick = useCallback(() => history.push('surveys/'), [history]);
    const handleSurveyClick = useCallback(survey => {
        history.push(`surveys/${survey.id}`);
    }, [history]);
    const handleDeleteClick = useCallback((survey) => {
        setActiveSurveyId(survey.id);
        setShowDeleteModal(true);
    }, []);

    const renderDataItem = useCallback(tableProps => (
        <DataItem 
            onDelete={handleDeleteClick}
            onClone={handleCloneSurvey} 
            {...tableProps} 
        />
    ), [handleCloneSurvey, handleDeleteClick]);

    return (
        <div className={styles.surveys}>
            <div className={styles.surveyHeader}>
                <h3 className={styles.surveyTitle}>Surveys</h3>
                {hasEditAccess && (
                    <Button 
                        outline 
                        onClick={onTakeSurveyClick} 
                        className={styles.button}
                    >
                        <BsPlus size={20} className={styles.buttonIcon} /> Take Survey
                    </Button>
                )}
            </div>
            <p className={styles.subTitle}>{surveyData.length} surveys</p>
            <div className={styles.surveyTable}>
                <Table 
                    className={styles.table} 
                    data={surveyData} 
                    columns={surveyColumns} 
                    maxRows={10}
                    renderHeaderItem={HeaderItem}
                    renderDataItem={renderDataItem}
                    headerClassName={styles.tableHeader}
                    headerRowClassName={styles.headerRow}
                    bodyClassName={styles.tableBody}
                    bodyRowClassName={styles.bodyRow}
                    onRowClick={handleSurveyClick}
                /> 
            </div>
            <Button className={styles.buttonBottom} secondary outline onClick={handleMoreClick}>
                More Details <BsArrowRight size={20} className={styles.buttonBottomIcon} />
            </Button>
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

export default SurveyTable;

import {useCallback, useState, useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {BsPlus, BsArrowRight} from 'react-icons/bs';

import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import OptionsDropdown from 'components/OptionsDropdown';
import TakeSurveyModal from 'components/TakeSurveyModal';
import DeleteSurveyModal from 'components/DeleteSurveyModal';
import DeleteDraftModal from 'components/DeleteDraftModal';
import Table from '@ra/components/Table';
import {Localize} from '@ra/components/I18n';

import Api from 'services/api';
import {_} from 'services/i18n';
import Toast from 'services/toast';

import {initDraftAnswers} from 'utils/dispatch';
import {checkEditAccess} from 'utils/permission';
import * as questionActions from 'store/actions/question';
import {getFormattedSurveys} from 'store/selectors/survey';

import styles from './styles.scss';

const HeaderItem = ({column}) => {
    if(column.Header==='Options') {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column, clonable}) => {
    const dispatch = useDispatch();

    const {activeProject} = useSelector(state => state.project);

    const {projectId: draftId, title, moduleCode, draftAnswers} = useSelector(state => state.draft);
    const {questions} = useSelector(state => state.question);

    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false);

    const doesDraftExist = useMemo(() => draftId && title, [draftId, title]);
    const itemAnswers = useMemo(() => item.answers.map(sur => (
        {...sur, question: sur.question.id}
    )), [item]);

    const handleShowDeleteSurveyModal= useCallback((survey) => {
        setShowDeleteModal(true);
    }, []);
    const hideDeleteSurveyModal = useCallback(() => {
        setShowDeleteModal(false);
    }, []);

    const handleShowSurveyModal = useCallback(() => {
        dispatch(questionActions.setAnswers(itemAnswers));
        initDraftAnswers(activeProject.id);
        setShowSurveyModal(true);
    }, [dispatch, activeProject, itemAnswers]);
    const hideSurveyModal = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowSurveyModal(false);
    }, [dispatch]);

    const handleShowDeleteDraftModal = useCallback((survey) => {
        if(!clonable) {
            return Toast.show(_('Please wait until survey answers are loaded before cloning!'), Toast.DANGER);
        }
        if(doesDraftExist) {
            return setShowDeleteDraftModal(true);
        }
        handleShowSurveyModal();
    }, [handleShowSurveyModal, doesDraftExist, clonable]);
    const handleHideDeleteDraftModal = useCallback(() => {
        setShowDeleteDraftModal(false);
    }, []);

    const handleResumeDraftSurvey = useCallback(() => {
        dispatch(questionActions.setAnswers(draftAnswers));
        if(!questions?.[moduleCode]?.length) {
            Api.getQuestions(moduleCode);
        }
        setShowDeleteDraftModal(false);
        setShowSurveyModal(true);
    }, [dispatch, draftAnswers, moduleCode, questions]);

    const stopEventBubbling = useCallback(e => e.stopPropagation(), []);

    const hasEditAccess = useMemo(() => 
        checkEditAccess(activeProject?.accessLevel), 
    [activeProject]);

    if(column.Header===_('Name')) {
        return <div className={styles.nameItem}>{item[column.accessor]}</div>;
    }
    if(column.Header===_('Created on')) {
        const date = new Date(item[column.accessor]);
        return date.toLocaleDateString();
    }
    if(column.Header===_('Options')) {
        if(!hasEditAccess) {
            return null;
        }
        return (
            <div onClick={stopEventBubbling}>
                <OptionsDropdown 
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
                    module={moduleCode}
                    isVisible={showDeleteDraftModal}
                    onResume={handleResumeDraftSurvey}
                    onClose={handleHideDeleteDraftModal}
                    onDelete={handleShowSurveyModal}
                />
            </div>
        );
    }
    return item[column.accessor];
};

const SurveyTable = ({onTakeSurveyClick, clonable}) => {
    const surveyColumns = useMemo(() => ([
        {
            Header: _('Name'),
            accessor: 'title',
        }, 
        {
            Header: _('Created on'),
            accessor: 'createdAt',
        },
        {
            Header: _('Options'),
            accessor: '',
        },
    ]), []);

    const {projectId} = useParams();
    const navigate = useNavigate();

    const {activeProject} = useSelector(state => state.project);

    const surveys = useSelector(getFormattedSurveys);
    const surveyData = useMemo(() => surveys.filter(el => el.project === +projectId), [surveys, projectId]);

    const hasEditAccess = useMemo(() => 
        checkEditAccess(activeProject?.accessLevel), 
    [activeProject]);

    const handleMoreClick = useCallback(() => navigate('surveys/'), [navigate]);
    const handleSurveyClick = useCallback(survey => {
        navigate(`surveys/${survey.id}/`);
    }, [navigate]);

    const renderDataItem = useCallback(tableProps => (
        <DataItem {...tableProps} clonable={clonable} />
    ), [clonable]);

    return (
        <div className={styles.surveys}>
            <div className={styles.surveyHeader}>
                <h3 className={styles.surveyTitle}><Localize>Surveys</Localize></h3>
                {hasEditAccess && (
                    <Button 
                        outline 
                        onClick={onTakeSurveyClick} 
                        className={styles.button}
                    >
                        <BsPlus size={20} className={styles.buttonIcon} /> <Localize>Take Survey</Localize>
                    </Button>
                )}
            </div>
            <p className={styles.subTitle}>
                <Localize text="1 survey" textPlural="{{ count }} surveys" count={surveyData.length} />
            </p>
            <div className={styles.surveyTable}>
                <Table 
                    loading={!activeProject || (activeProject.surveysCount > 0 && !surveyData.length)}
                    LoadingComponent={<NeatLoader medium />}
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
                <Localize>More Details</Localize> <BsArrowRight size={20} className={styles.buttonBottomIcon} />
            </Button>
        </div> 
    );
};

export default SurveyTable;

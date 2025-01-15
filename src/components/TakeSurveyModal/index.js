import {useCallback, useState, useMemo, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {MdClose, MdOutlineCheckCircle, MdOutlineCloudUpload} from 'react-icons/md';
import {BsArrowLeft, BsArrowRight} from 'react-icons/bs';
import {RiSkipBackLine, RiSkipForwardLine} from 'react-icons/ri';
import {IoIosArrowDropright, IoIosArrowDropleft} from 'react-icons/io';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import withVisibleCheck from '@ra/components/WithVisibleCheck';

import {_} from 'services/i18n';
import Toast from 'services/toast';

import useSize from '@ra/hooks/useSize';
import usePromise from '@ra/hooks/usePromise';

import CompletedTaskImage from 'assets/images/completed-task.svg';
import NoSurveyImage from 'assets/images/no-survey.svg';

import cs from '@ra/cs';
import {getErrorMessage} from '@ra/utils/error';
import {parseSkipLogic} from 'utils/skipLogic';
import {formatTime} from 'utils/time';

import Api from 'services/api';
import * as questionActions from 'store/actions/question';

import Question from './Question';
import styles from './styles.scss';
import Loader from 'components/Loader';
import InfoTooltip from 'components/InfoTooltip';

const keyExtractor = item => item.id;

const QuestionGroupItem = props => {
    const {
        item,
        index,
        onItemClick,
        activeGroupId,
        incompleteQuestionGroups,
        isTouched,
    } = props;

    const handleItemClick = useCallback(() => {
        if(isTouched) {
            onItemClick && onItemClick(index);
        }
    }, [index, onItemClick, isTouched]);

    return (
        <p tabIndex={index === 0 ? 1 : undefined} className={cs(styles.groupItem, {
            [styles.groupItemIncomplete]: isTouched && incompleteQuestionGroups.some(grp => grp.id === item.id),
            [styles.groupItemActive]: item.id===activeGroupId,
            [styles.groupItemActiveIncomplete]: item.id === activeGroupId && incompleteQuestionGroups.some(grp => grp.id === item.id),
            [styles.groupItemUntouched]: !isTouched,
        })} onClick={handleItemClick}>
            {item.title}
        </p>
    );
};

const GroupContent = props => {
    const {answers} = useSelector(state => state.question);

    const {
        surveyModuleId,
        activeGroup,
        questions,
        onPreviousClick,
        onNextClick,
        showPrevious,
        showNext,
        showRequired,
        editable,
    } = props;

    const questionsRef = useRef(new Array(questions.length));

    const handleNextClick = useCallback(() => {
        const quesIdx = questions.findIndex(que =>
            que.isRequired &&
            answers &&
            !answers?.some(ans => ans.question === que.id));
        if(quesIdx!==-1) {
            const scrollTop = questionsRef.current.slice(0, quesIdx).reduce((acc, cur) => {
                return acc + cur.offsetHeight;
            }, 1);
            return onNextClick(scrollTop);
        }
        onNextClick();
    }, [onNextClick, answers, questions]);

    const renderQuestion = useCallback(listProps => {
        return (
            <Question
                surveyModuleId={surveyModuleId}
                ref={el => questionsRef.current[listProps.index] = el}
                editable={editable}
                showRequired={showRequired}
                {...listProps}
            />
        );
    }, [showRequired, editable, surveyModuleId]);

    return (
        <>
            <h3 className={styles.contentTitle}>{activeGroup?.title}</h3>
            <List
                data={questions}
                renderItem={renderQuestion}
                keyExtractor={keyExtractor}

            />
            <div className={styles.buttons}>
                {showPrevious && (
                    <Button
                        secondary
                        className={styles.button}
                        onClick={onPreviousClick}
                    >
                        <BsArrowLeft size={22} className={styles.buttonIconLeft} />
                        <Localize>Previous</Localize>
                    </Button>
                )}
                {showNext && (
                    <Button
                        className={cs(styles.button, styles.buttonNext)}
                        onClick={handleNextClick}
                    >
                        <Localize>Next</Localize>
                        <BsArrowRight size={22} className={styles.buttonIconRight} />
                    </Button>
                )}
            </div>
        </>
    );
};

const TakeSurveyModal = (props) => {
    const contentRef = useRef();

    const dispatch = useDispatch();
    const {modules = []} = useSelector(state => state.context);

    const {
        survey,
        surveyModuleId,
        onClose,
        editable: isEditable = true,
        moduleCode,
    } = props;

    useEffect(() => {
        if(!survey || !surveyModuleId) {
            Toast.show(_('There was an error loading the survey questionnaire. Please try again later!', Toast.ERROR));
            onClose();
        }
    }, [survey, surveyModuleId, onClose]);

    const [editMode] = useState(false);
    const editable = useMemo(() => isEditable || editMode, [editMode, isEditable]);

    const {
        questionGroups: allQuestionGroups,
        questions,
        answers,
        // status
    } = useSelector(state => state.question);

    const [{loading: loadingQuestionGroups}, getQuestionGroups] = usePromise(Api.getQuestionGroups);
    useEffect(() => {
        if(!allQuestionGroups.length) {
            getQuestionGroups();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getQuestionGroups]);

    // const initializeNewDraft = useCallback(() => {

    // dispatch(draftActions.setTitle(activeSurvey?.title));
    // dispatch(draftActions.setDraftAnswers(answers));
    // dispatch(draftActions.setProjectId(+params.projectId));
    // dispatch(draftActions.setSurveyId(activeSurvey?.id));
    // dispatch(draftActions.setDraftModule(code));
    // }, []);

    // const handleEditButtonClick = useCallback(() => {
    // if(doesDraftExist) {
    //     return setShowDeleteDraftModal(true);
    // }
    // initializeNewDraft();
    // setEditMode(true);
    // }, []);

    const activeModule = useMemo(() => modules.find(mod => mod.code === moduleCode), [modules, moduleCode]);

    // const [{loading: addingAnswers}, addSurveyAnswers] = useRequest(
    //     `/survey/${draftSurveyId}/add_answers/`,
    //     {method: 'POST'}
    // );
    // const [{loading: addingResults}, addSurveyResults] = useRequest(
    //     `/survey/${draftSurveyId}/add_results/`,
    //     {method: 'POST'}
    // );

    const questionGroups = useMemo(() => {
        return allQuestionGroups.filter(group => {
            if(group.module === activeModule?.id && group.skipLogic) {
                return !parseSkipLogic(group.skipLogic, {questions: questions[moduleCode], answers});
            }
            return group.module === activeModule?.id;
        });
    }, [moduleCode, allQuestionGroups, questions, answers, activeModule]);

    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [showRequired, setShowRequired] = useState(false);

    const {width} = useSize(document);
    const [collapsed, setCollapsed] = useState(width < 768);

    const toggleCollapsed = useCallback(() => {
        setCollapsed(!collapsed);
    }, [collapsed]);

    const [error] = useState(null);

    const activeGroup = questionGroups[activeGroupIndex];
    const activeQuestions = useMemo(() => questions[moduleCode]?.filter(ques =>
        ques.group === activeGroup?.id
    ) || [], [questions, activeGroup, moduleCode]);

    const [isSynced, setIsSynced] = useState(true);
    const [{loading: savingDraft}, saveDraftAnswersPromise] = usePromise(Api.addSurveyAnswers);
    
    const filteredAnswers = useMemo(() => answers.filter(ans => {
        const questionItem = (questions[moduleCode] || []).find(ques => ques.id === ans.question);
        return questionGroups.some(grp => questionItem && grp.id === questionItem.group);
    }), [answers, questions, moduleCode, questionGroups]);
    
    const handleSaveDraftAnswers = useCallback(async () => {
        try {
            await saveDraftAnswersPromise(survey?.id, filteredAnswers);
            setIsSynced(true);
        } catch(err) {
            Toast.show(_('An error occurred while saving draft!', Toast.DANGER));
        }
    }, [saveDraftAnswersPromise, survey, filteredAnswers]);
    useEffect(() => {
        if(filteredAnswers.length) {
            setIsSynced(false);
        }
    }, [filteredAnswers]);

    const handlePreviousClick = useCallback(() =>
        setActiveGroupIndex(activeGroupIndex - 1),
    [activeGroupIndex]
    );
    const handleNextClick = useCallback((scrollTop) => {
        if(editable && activeQuestions.some(ques =>
            ques.isRequired &&
            answers &&
            !answers?.some(ans => ans.question === ques.id))
        ) {
            if(scrollTop) {
                contentRef.current.scrollTo({top: scrollTop, behavior: 'smooth'});
            }
            setShowRequired(true);
        }
        handleSaveDraftAnswers();

        // if(!clone && editable) {
        //     dispatch(draftActions.setDraftAnswers(answers, activeDraftIndex));
        // }
        setActiveGroupIndex(activeGroupIndex + 1);
        contentRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }, [
        handleSaveDraftAnswers,
        activeGroupIndex,
        activeQuestions,
        answers,
        editable,
    ]);

    const isFormIncomplete = useMemo(() => {
        if(!editable) {
            return false;
        }
        return questions[moduleCode]?.some(ques =>
            ques.isRequired &&
            questionGroups.map(grp => grp.id).includes(ques.group) &&
            answers &&
            !answers?.some(ans => ans.question === ques.id)
        );
    }, [questions, answers, editable, moduleCode, questionGroups]);

    const handleFirstIndex = useCallback(() => setActiveGroupIndex(0), []);
    const handleLastIndex = useCallback(() =>
        setActiveGroupIndex(questionGroups.length),
    [questionGroups]
    );

    const handleQuestionGroupClick = useCallback((idx) => {
        if(editable && idx > activeGroupIndex) {
            setShowRequired(true);
        }
        setActiveGroupIndex(idx);
        contentRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }, [activeGroupIndex, editable]);

    const handleClose = useCallback(() => {
        // if(editable) {
        //     dispatch(draftActions.setDraftAnswers(answers, activeDraftIndex));
        // }
        dispatch(questionActions.setAnswers([]));
        onClose && onClose();
    }, [onClose, dispatch]);

    // const handleValidate = useCallback(async () => {
    //     setError(null);
    //     try {
    // const results = await calculateSurveyResults(filteredAnswers, code);
    // const project = projectId;
    // const submissionAnswers = filteredAnswers.map(ans => {
    //     if(ans.formattedAnswer) {
    //         delete ans.formattedAnswer;
    //     }
    //     if(ans.answerType==='single_option' || ans.answerType==='multiple_option') {
    //         return {...ans, answer: null};
    //     }
    //     return ans;
    // });
    // if(code==='sens') {
    //     const response  = await createSurvey({
    //         title: surveyTitle,
    //         answers: submissionAnswers,
    //         project,
    //         results,
    //     });
    //     Toast.show(response?.detail || _('Survey complete!'), Toast.SUCCESS);
    // } else {
    //     await addSurveyAnswers(filteredAnswers);
    //     const response = await addSurveyResults(results);
    //     Toast.show(response?.detail || _('Survey complete!'), Toast.SUCCESS);
    // }
    // dispatch(questionActions.setAnswers([]));
    // handleClose();
    // if(params.projectId) {
    //     Api.getSurveys({project: params.projectId});
    //     Api.getSurveyDetails(+params.projectId);
    // }
    // initDraftAnswers(null);
    //     } catch(err) {
    //         setError(err);
    //         console.log(err);
    //     }
    // }, [
    //     filteredAnswers,
    //     questions,
    //     questionGroups,
    //     code,
    // ]);

    const incompleteQuestionGroups = useMemo(() => {
        if(!editable) {
            return [];
        }
        return questionGroups.filter(grp => {
            return questions[moduleCode]?.some(ques => ques && ques.group === grp.id && ques.isRequired && answers &&
                !answers?.some(ans => ans.question === ques.id));
        });
    }, [answers, moduleCode, questionGroups, questions, editable]);

    const answeredGroups = useMemo(() => {
        if(!editable) {
            return questionGroups;
        }
        return questionGroups.filter(grp => {
            const groupQuestions = (questions[moduleCode] || []).filter(q => q && q.group === grp.id);
            if(groupQuestions.every(gq => gq.answerType === 'description')) {
                return true;
            }
            return groupQuestions.some(ques => {
                return answers?.some(ans => ans.question === ques.id);
            });
        });
    }, [editable, answers, moduleCode, questions, questionGroups]);

    const maxTouchedGroupIndex = useMemo(() => {
        const answeredGroupIndexes = answeredGroups.map((_, idx) => idx);
        if(answeredGroupIndexes.length > 0) {
            const maxIdx = Math.max(...answeredGroupIndexes);
            if(activeGroupIndex > maxIdx) {
                return activeGroupIndex;
            }
            return maxIdx;
        }
        return 0;
    }, [answeredGroups, activeGroupIndex]);

    const touchedGroupIndexes = useMemo(() => {
        return [...Array(maxTouchedGroupIndex + 1).keys()];
    }, [maxTouchedGroupIndex]);

    const totalQuestions = useMemo(() => {
        return questions[moduleCode]?.filter((question) => question.answerType !== 'description').length;
    }, [questions, moduleCode]);

    const estimatedTime = useMemo(() => {
        return formatTime(activeModule?.questionCompletionTime);
    }, [activeModule]);

    const renderQuestionGroupItem = useCallback(listProps => (
        <QuestionGroupItem
            {...listProps}
            activeGroupId={activeGroup?.id}
            incompleteQuestionGroups={incompleteQuestionGroups}
            onItemClick={handleQuestionGroupClick}
            isTouched={touchedGroupIndexes.some(grpIdx => grpIdx === listProps.index)}
            showRequiredError={listProps.index !== maxTouchedGroupIndex}
        />
    ), [touchedGroupIndexes, activeGroup, incompleteQuestionGroups, handleQuestionGroupClick, maxTouchedGroupIndex]);

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        {survey?.title}
                        {/* editable ? surveyTitle : activeSurvey?.title */}
                    </h2>
                    <h3 className={styles.subTitle}>
                        {totalQuestions} Questions | Estimated Time: {estimatedTime}
                    </h3>
                </div>
                <div className={styles.headerRight}>
                    {/*isNewEdit && (
                        <>
                            {!editable ? (
                                <Button onClick={handleEditButtonClick} className={styles.editButton}>
                                    <Localize>Enable Edit</Localize>
                                </Button>
                            ) : (
                                <Button disabled outline className={styles.editButton}>
                                    <Localize>Editing...</Localize>
                                </Button>
                            )}
                        </>
                    )*/}
                    <div className={styles.closeContainer} onClick={handleClose}>
                        <MdClose size={20} className={styles.closeIcon} />
                    </div>
                </div>
            </div>
            <div className={styles.progressContainer}>
                <div
                    className={styles.progress}
                    style={{
                        width: activeGroupIndex / questionGroups.length * 100 + '%',
                    }}
                />
            </div>
            <div className={styles.contentContainer}>
                {collapsed && (
                    <IoIosArrowDropright onClick={toggleCollapsed} size={22} className={styles.expandIcon} />
                )}
                <div className={cs(styles.groupList, {
                    [styles.groupListCollapsed]: collapsed
                })}>
                    <List
                        loading={loadingQuestionGroups}
                        data={questionGroups}
                        keyExtractor={keyExtractor}
                        renderItem={renderQuestionGroupItem}
                        HeaderComponent={!collapsed && (
                            <div className={styles.groupHeader}>
                                <div className={styles.groupTitle}>
                                    <Localize>QUESTION GROUPS</Localize>
                                </div>
                                <IoIosArrowDropleft onClick={toggleCollapsed} size={22} className={styles.collapseIcon} />
                            </div>
                        )}
                    />
                </div>
                <div ref={contentRef} className={styles.content}>
                    <div className={styles.contentHeader}>
                        <div onClick={handleSaveDraftAnswers}>
                            {savingDraft ? (
                                <Loader color="var(--color-primary)" />
                            ) : isSynced ? (
                                <InfoTooltip 
                                    size={28}
                                    icon={MdOutlineCheckCircle}
                                    fill="var(--color-primary)"
                                    message={_('Draft synced!')}
                                />
                            ) : (
                                <InfoTooltip 
                                    icon={MdOutlineCloudUpload} 
                                    iconSize={28} 
                                    message={_('Save draft')}
                                    fill="var(--color-primary)"
                                />
                            )}
                        </div>
                        <div className={styles.languageSelect}>English</div>
                    </div>
                    {activeGroupIndex === questionGroups?.length ? (
                        <>
                            <div className={styles.contentMessage}>
                                <div className={styles.contentTextContainer}>
                                    <img
                                        src={isFormIncomplete ? NoSurveyImage : CompletedTaskImage}
                                        alt={isFormIncomplete ? _('Task Incomplete')  : _('Task Complete')}
                                        className={styles.completeImage}
                                    />
                                    <p className={styles.completeText}>
                                        {isFormIncomplete
                                            ? _('You have not filled in all the required fields in the form.')
                                            : _('You have now completed all modules and sub-modules that you previously selected in the initial NEAT+ survey page.')
                                        }
                                    </p>
                                    <p className={cs(styles.completeText, {
                                        [styles.completeTextWarning]: isFormIncomplete,
                                    })}>
                                        {isFormIncomplete
                                            ? _('Please go back and complete the form in order to continue.')
                                            : _('Please follow the provided instructions for how to download and analyse this information.')
                                        }
                                    </p>
                                </div>
                            </div>
                            {!!error && (
                                <span className={styles.errorMessage}>
                                    {getErrorMessage(error)}
                                </span>
                            )}
                            <div className={styles.buttons}>
                                <Button
                                    secondary
                                    className={styles.button}
                                    onClick={handlePreviousClick}
                                >
                                    <BsArrowLeft size={22} className={styles.buttonIconLeft} />
                                    <Localize>Previous</Localize>
                                </Button>
                                {/*
                                    editable && (
                                    <Button
                                        disabled={
                                            isFormIncomplete
                                                || !questionGroups?.length
                                                || !AVAILABLE_SURVEY_MODULES.includes(moduleCode)
                                        }
                                        loading={loading || addingAnswers || addingResults}
                                        className={cs(styles.button, styles.buttonNext)}
                                        onClick={handleValidate}
                                    >
                                        <BsCheck size={22} className={styles.buttonIconLeft} />

                                        <Localize>Calculate</Localize>
                                    </Button>
                                )
                                */}
                            </div>
                        </>
                    ) : (
                        <GroupContent
                            surveyModuleId={surveyModuleId}
                            editable={editable}
                            activeGroup={activeGroup}
                            questions={activeQuestions}
                            onPreviousClick={handlePreviousClick}
                            onNextClick={handleNextClick}
                            showPrevious={activeGroupIndex!==0}
                            showNext={activeGroupIndex!==questionGroups.length}
                            showRequired={showRequired}
                        />
                    )}
                </div>

            </div>
            <div className={styles.footer}>
                <div className={styles.footerLink} onClick={handleFirstIndex}>
                    <RiSkipBackLine size={20} className={styles.footerLinkIconLeft} />
                    <Localize>Back to the beginning</Localize>
                </div>
                {questionGroups?.length <= touchedGroupIndexes.length && (
                    <div className={styles.footerLink} onClick={handleLastIndex}>
                        <Localize>Go to the end</Localize>
                        <RiSkipForwardLine size={20} className={styles.footerLinkIconRight} />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default withVisibleCheck(TakeSurveyModal);

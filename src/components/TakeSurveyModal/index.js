import {useCallback, useState, useMemo, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {MdClose} from 'react-icons/md';
import {BsArrowLeft, BsArrowRight, BsCheck} from 'react-icons/bs';
import {RiSkipBackLine, RiSkipForwardLine} from 'react-icons/ri';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import List from '@ra/components/List';

import useRequest from 'hooks/useRequest';
import CompletedTaskImage from 'assets/images/completed-task.svg';
import NoSurveyImage from 'assets/images/no-survey.svg';

import cs from '@ra/cs';
import {getErrorMessage} from '@ra/utils/error';
import {calculateSurveyResults} from 'utils/calculation';
import {initDraftAnswers} from 'utils/dispatch';

import Api from 'services/api';
import Toast from 'services/toast';
import * as questionActions from 'store/actions/question';
import * as draftActions from 'store/actions/draft';

import Question from './Question';
import InitSurvey from './InitSurvey';
import styles from './styles.scss';

const keyExtractor = item => item.id;

const GroupContent = props => {
    const {answers} = useSelector(state => state.question);

    const {
        activeGroup,
        questions,
        onPreviousClick,
        onNextClick,
        showPrevious,
        showNext,
        showRequired,
        editable
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
                ref={el => questionsRef.current[listProps.index] = el}
                editable={editable} 
                showRequired={showRequired} 
                {...listProps} 
            />
        );
    }, [showRequired, editable]);

    return (
        <>
            <div className={styles.languageSelect}>English</div>
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
                        Previous
                    </Button>
                )}
                {showNext && (
                    <Button 
                        className={cs(styles.button, styles.buttonNext)} 
                        onClick={handleNextClick}
                    >
                        Next
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
    const {activeSurvey} = useSelector(state => state.survey);
    const {
        title: surveyTitle, 
        projectId: draftProjectId,
        moduleCode,
    } = useSelector(state => state.draft);

    const {
        isVisible, 
        onClose, 
        editable = true, 
        clone,
    } = props;

    const {
        questionGroups: allQuestionGroups, 
        questions, 
        status, 
        answers
    } = useSelector(state => state.question);

    useEffect(() => {
        if(!questions[moduleCode]?.length) {
            Api.getQuestions(moduleCode);
        }
    }, [moduleCode, questions]);

    useEffect(() => {
        if(!surveyTitle && moduleCode!=='sens') {
            dispatch(draftActions.setTitle(activeSurvey?.title));
        }
    }, [activeSurvey, dispatch, moduleCode, isVisible, surveyTitle]);

    const [{loading}, createSurvey] = useRequest(
        `/project/${draftProjectId}/create_survey/`, 
        {method: 'POST'}
    );

    const questionGroups = useMemo(() => {
        return allQuestionGroups.filter(group => {
            return questions[moduleCode]?.some(que => que.group === group.id);
        });
    }, [moduleCode, allQuestionGroups, questions]);

    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [showRequired, setShowRequired] = useState(false);

    const [error, setError] = useState(null);

    const activeGroup = questionGroups[activeGroupIndex];
    const activeQuestions = useMemo(() => questions[moduleCode]?.filter(ques => 
        ques.group === activeGroup?.id
    ) || [], [questions, activeGroup, moduleCode]);

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
            return setShowRequired(true);
        }
        if(!clone && editable) {
            dispatch(draftActions.setDraftAnswers(answers));
        }
        setShowRequired(false);
        setActiveGroupIndex(activeGroupIndex + 1);
        contentRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }, [
        activeGroupIndex, 
        activeQuestions, 
        answers, 
        editable, 
        dispatch,
        clone,
    ]);

    const isFormIncomplete = useMemo(() => {
        if(!editable) {
            return false;
        }
        return questions[moduleCode]?.some(ques =>
            ques.isRequired &&
            answers &&
            !answers?.some(ans => ans.question === ques.id));
    }, [questions, answers, editable, moduleCode]);

    const handleFirstIndex = useCallback(() => setActiveGroupIndex(0), []);
    const handleLastIndex = useCallback(() => 
        setActiveGroupIndex(questionGroups.length),
    [questionGroups]
    );

    const handleClose = useCallback(() => {
        if(editable) {
            dispatch(draftActions.setDraftAnswers(answers));
        }
        dispatch(questionActions.setAnswers([]));
        onClose && onClose();
    }, [onClose, editable, dispatch, answers]);

    const handleValidate = useCallback(async () => {
        setError(null);
        try {
            const results = calculateSurveyResults(answers);
            const project = draftProjectId;
            const response  = await createSurvey({
                title: surveyTitle,
                answers,
                project,
                results,
            });
            Toast.show(response?.detail || 'Survey complete!', Toast.SUCCESS);
            dispatch(questionActions.setAnswers([]));
            initDraftAnswers(null);
            handleClose();
            Api.getSurveys();
        } catch(err) {
            setError(err);
            console.log(err);
        }
    }, [
        answers, 
        createSurvey, 
        handleClose, 
        dispatch,
        draftProjectId,
        surveyTitle,
    ]);

    if(!isVisible) {
        return null;
    }

    if(!surveyTitle && editable && moduleCode==='sens') {
        return (
            <InitSurvey 
                clone={clone}
                questionsStatus={status}
                isVisible={!surveyTitle} 
                onClose={onClose} 
            />
        );
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {editable ? surveyTitle : activeSurvey?.title}
                </h2>
                <div className={styles.closeContainer} onClick={handleClose}>
                    <MdClose size={20} className={styles.closeIcon} />
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
            <div ref={contentRef} className={styles.content}>
                {activeGroupIndex === questionGroups?.length ? (
                    <>
                        <div className={styles.contentMessage}>
                            <div className={styles.contentTextContainer}>
                                <img 
                                    src={isFormIncomplete ? NoSurveyImage : CompletedTaskImage} 
                                    alt={isFormIncomplete ? 'Task Incomplete'  : 'Task Complete'}
                                    className={styles.completeImage} 
                                />     
                                <p className={styles.completeText}>
                                    {isFormIncomplete 
                                        ? 'You have not filled in all the required fields in the form.' 
                                        : 'You have now completed all modules and sub-modules that you previously selected in the NEAT+ activity KoBo form.'
                                    } 
                                </p>
                                <p className={cs(styles.completeText, {
                                    [styles.completeTextWarning]: isFormIncomplete,
                                })}>
                                    {isFormIncomplete 
                                        ? 'Please go back and complete the form in order to continue.'
                                        : 'Please follow the provided instructions for how to download and analyse this information.'
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
                                Previous
                            </Button>
                            {editable && (
                                <Button 
                                    // TODO: Submit for modules other than sensitivity
                                    disabled={isFormIncomplete || moduleCode!=='sens'}
                                    loading={loading}
                                    className={cs(styles.button, styles.buttonNext)} 
                                    onClick={handleValidate}
                                >
                                    <BsCheck size={22} className={styles.buttonIconLeft} />

                                    Validate
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <GroupContent 
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
            <div className={styles.footer}>
                <div className={styles.footerLink} onClick={handleFirstIndex}>
                    <RiSkipBackLine size={20} className={styles.footerLinkIconLeft} />
                    Back to the beginning
                </div>
                <div className={styles.footerLink} onClick={handleLastIndex}>
                    Go to the end
                    <RiSkipForwardLine size={20} className={styles.footerLinkIconRight} />
                </div>
            </div>
        </Modal>
    );
};

export default TakeSurveyModal;

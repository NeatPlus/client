import {useCallback, useState, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
    
import {MdClose} from 'react-icons/md';
import {BsArrowLeft, BsArrowRight, BsCheck} from 'react-icons/bs';
import {RiSkipBackLine, RiSkipForwardLine} from 'react-icons/ri';

import Button from 'components/Button';
import LocationInput from 'components/Inputs/LocationInput';
import SingleOptionInput from 'components/Inputs/SingleOptionInput';
import MultiOptionInput from 'components/Inputs/MultiOptionInput';
import BooleanInput from 'components/Inputs/BooleanInput';

import Modal from '@ra/components/Modal';
import List from '@ra/components/List';
import Input from '@ra/components/Form/Input';
import DateInput from '@ra/components/Form/DateInput';
import NumberInput from '@ra/components/Form/NumberInput';
import FileInput from '@ra/components/Form/FileInput';

import useRequest from 'hooks/useRequest';
import CompletedTaskImage from 'assets/images/completed-task.svg';
import NoSurveyImage from 'assets/images/no-survey.svg';

import cs from '@ra/cs';
import {getErrorMessage} from '@ra/utils/error';
import Api from 'services/api';
import Toast from 'services/toast';
import * as questionActions from 'store/actions/question';

import InitSurvey from './InitSurvey';
import styles from './styles.scss';

const keyExtractor = item => item.id;

const getInputComponent = question => {
    switch(question.answerType) {
    case 'date':
        return DateInput;
    case 'boolean':
        return BooleanInput;        
    case 'location':
        return LocationInput;
    case 'single_option':
        return SingleOptionInput;
    case 'multiple_option':
        return MultiOptionInput;
    case 'number':
        return NumberInput;
    case 'image':
        return FileInput;
    default:
        return Input;
    }
};

const Question = ({item, showRequired}) => {
    const dispatch = useDispatch();
    const {options, answers} = useSelector(state => state.question);

    const InputComponent = getInputComponent(item);

    const showRequiredMessage = useMemo(() => 
        item.isRequired && 
        showRequired && 
        answers && 
        !answers?.some(
            ans => ans.question === item.id
        ), 
    [item, showRequired, answers]
    );

    const handleChangeAnswer = useCallback(({value}) => {
        const answer = {
            answerType: item.answerType,
            question: item.id,
        };
        if(item.answerType === 'single_option' || 
            item.answerType === 'multiple_option') {
            answer.options = value;    
        } else {
            answer.answer = value;
        }
        const answerIndex = answers.findIndex(ans => ans.question === item.id);
        if(answerIndex!==-1) {
            const newAnswers = answers;
            if(!value || (value && value?.length===0)) {
                newAnswers.splice(answerIndex, 1);   
            } else {
                newAnswers.splice(answerIndex, 1, answer);
            }
            return dispatch(questionActions.setAnswers([...newAnswers]));
        }
        dispatch(questionActions.setAnswers([...answers, answer]));
    }, [item, answers, dispatch]);

    const answerItem = answers.find(ans => ans.question === item.id);

    return (
        <>
            <div className={cs(styles.contentBlock, {
                [styles.contentBlockRequired]: showRequiredMessage,
            })}>
                <p className={cs(styles.contentBlockTitle, {
                    [styles.descriptionTitle]: item.answerType==='description',
                    [styles.inputTitle]: item.answerType!=='description',
                })}>
                    {item.title}
                </p>
                {!!item.hints && (
                    <p className={styles.contentHint}>{item.hints}</p>
                )}
                {item.answerType!=='description' ? (
                    <InputComponent
                        className={styles.input} 
                        placeholder="Add Answer..." 
                        onChange={handleChangeAnswer}
                        options={options?.filter(opt => opt.question === item.id)}
                        checkedOptions={answerItem?.options}
                        value={answerItem?.answer}
                        answer={answerItem?.answer}
                        accept="image/png, image/jpeg"
                    />
                ) : (
                    <p className={styles.contentBlockText}>
                        {item.description} 
                    </p>
                )}
            </div>
            {showRequiredMessage && (
                <span className={styles.requiredText}>Required</span>
            )}
        </>
    );
}; 

const GroupContent = props => {
    const {
        activeGroup,
        questions,
        onPreviousClick,
        onNextClick,
        showPrevious,
        showNext,
        showRequired,
    } = props;

    const renderQuestion = useCallback(listProps => (
        <Question showRequired={showRequired} {...listProps} />
    ), [showRequired]);

    return (
        <div className={styles.content}>
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
                        onClick={onNextClick}
                    >
                        Next
                        <BsArrowRight size={22} className={styles.buttonIconRight} />
                    </Button>
                )}
            </div>
        </div> 
    );
};

const TakeSurveyModal = (props) => {
    const dispatch = useDispatch();

    const {isVisible, onClose} = props;
    const {projectId} = useParams();

    const {questionGroups, questions, status, answers} = useSelector(state => state.question);

    const [{loading}, createSurvey] = useRequest(
        `/project/${projectId}/create_survey/`, 
        {method: 'POST'}
    );

    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [showRequired, setShowRequired] = useState(false);

    const [surveyTitle, setSurveyTitle] = useState('');
    const [error, setError] = useState(null);

    const activeGroup = questionGroups[activeGroupIndex];
    const activeQuestions = useMemo(() => questions?.filter(ques => 
        ques.group === activeGroup?.id
    ) || [], [questions, activeGroup]);

    const handlePreviousClick = useCallback(() => 
        setActiveGroupIndex(activeGroupIndex - 1), 
    [activeGroupIndex]
    );
    const handleNextClick = useCallback(() => {
        if(activeQuestions.some(ques => 
            ques.isRequired && 
            answers && 
            !answers?.some(ans => ans.question === ques.id))
        ) {
            return setShowRequired(true);
        }
        setShowRequired(false);
        setActiveGroupIndex(activeGroupIndex + 1);
    }, [activeGroupIndex, activeQuestions, answers]);

    const isFormIncomplete = useMemo(() => {
        return questions?.some(ques =>
            ques.isRequired &&
            answers &&
            !answers?.some(ans => ans.question === ques.id));
    }, [questions, answers]);

    const handleFirstIndex = useCallback(() => setActiveGroupIndex(0), []);
    const handleLastIndex = useCallback(() => 
        setActiveGroupIndex(questionGroups.length),
    [questionGroups]
    );

    const handleValidate = useCallback(async () => {
        setError(null);
        try {
            const result = await createSurvey({
                title: surveyTitle,
                answers,
                project: +projectId,
            });
            Toast.show(result?.detail || 'Survey complete!', Toast.SUCCESS);
            dispatch(questionActions.setAnswers([]));
            onClose && onClose();
            Api.getSurveys();
        } catch(err) {
            setError(err);
            console.log(err);
        }
    }, [answers, createSurvey, surveyTitle, projectId, onClose, dispatch]);

    const handleClose = useCallback(() => {
        setSurveyTitle('');
        onClose();
    }, [onClose]);

    if(!isVisible){
        return null;
    }

    if(!surveyTitle) {
        return (
            <InitSurvey 
                questionsStatus={status}
                setSurveyTitle={setSurveyTitle} 
                isVisible={!surveyTitle} 
                onClose={handleClose} 
            />
        );
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>{surveyTitle}</h2>
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
            {activeGroupIndex === questionGroups?.length ? (
                <div className={styles.content}>
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
                        <Button 
                            disabled={isFormIncomplete}
                            loading={loading}
                            className={cs(styles.button, styles.buttonNext)} 
                            onClick={handleValidate}
                        >
                            <BsCheck size={22} className={styles.buttonIconLeft} />

                            Validate
                        </Button>
                    </div>
                </div>
            ) : (
                <GroupContent 
                    activeGroup={activeGroup} 
                    questions={activeQuestions}
                    onPreviousClick={handlePreviousClick}
                    onNextClick={handleNextClick}
                    showPrevious={activeGroupIndex!==0}
                    showNext={activeGroupIndex!==questionGroups.length}
                    showRequired={showRequired}
                />
            )}
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

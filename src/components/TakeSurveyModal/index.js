import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
    
import {MdClose} from 'react-icons/md';
import {BsArrowLeft, BsArrowRight} from 'react-icons/bs';
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

import cs from '@ra/cs';

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

const Question = ({item}) => {
    const {options} = useSelector(state => state.survey);

    const InputComponent = getInputComponent(item);

    return (
        <div className={styles.contentBlock}>
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
                    options={options?.filter(opt => opt.question === item.id)}
                    accept="image/png, image/jpeg"
                />
            ) : (
                <p className={styles.contentBlockText}>
                    {item.description} 
                </p>
            )}
        </div>
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
    } = props;

    return (
        <div className={styles.content}>
            <div className={styles.languageSelect}>English</div>
            <h3 className={styles.contentTitle}>{activeGroup?.title}</h3>
            <List
                data={questions}
                renderItem={Question}
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
    const {isVisible, onClose} = props;

    const {questionGroups, questions} = useSelector(state => state.survey);

    const [activeGroupIndex, setActiveGroupIndex] = useState(0);

    const activeGroup = questionGroups[activeGroupIndex];
    const activeQuestions = questions?.filter(ques => ques.group === activeGroup?.id) || [];

    const handlePreviousClick = useCallback(() => setActiveGroupIndex(activeGroupIndex - 1), [activeGroupIndex]);
    const handleNextClick = useCallback(() => setActiveGroupIndex(activeGroupIndex + 1), [activeGroupIndex]);
    const handleFirstIndex = useCallback(() => setActiveGroupIndex(0), []);
    const handleLastIndex = useCallback(() => setActiveGroupIndex(questionGroups.length - 1), [questionGroups]);

    if(!isVisible){
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Take a survey</h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <GroupContent 
                activeGroup={activeGroup} 
                questions={activeQuestions}
                onPreviousClick={handlePreviousClick}
                onNextClick={handleNextClick}
                showPrevious={activeGroupIndex!==0}
                showNext={activeGroupIndex!==questionGroups.length - 1}
            />

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

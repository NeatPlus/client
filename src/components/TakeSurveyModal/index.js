import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
    
import {MdClose} from 'react-icons/md';
import {BsArrowLeft, BsArrowRight} from 'react-icons/bs';
import {RiSkipBackLine, RiSkipForwardLine} from 'react-icons/ri';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import List from '@ra/components/List';
import Input from '@ra/components/Form/Input';

import cs from '@ra/cs';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const GroupContent = ({activeGroup, questions}) => {
    const renderQuestion = useCallback(({item}) => {
        return (
            <div className={styles.contentBlock}>
                <p className={cs(styles.contentBlockTitle, {
                    [styles.descriptionTitle]: item.answerType==='description',
                    [styles.inputTitle]: item.answerType!=='description',
                })}>
                    {item.title}
                </p>
                {item.answerType!=='description' ? (
                    <Input 
                        className={styles.input} 
                        placeholder="Add Answer..." 
                    />
                ) : (
                    <p className={styles.contentBlockText}>
                        {item.description} 
                    </p>
                )}
            </div>
        );
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.languageSelect}>English</div>
            <h3 className={styles.contentTitle}>{activeGroup.title}</h3>
            <List
                data={questions}
                renderItem={renderQuestion}
                keyExtractor={keyExtractor}
            />
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
            />
            <div className={styles.buttons}>
                {activeGroupIndex!==0 && (
                    <Button
                        secondary 
                        className={styles.button} 
                        onClick={handlePreviousClick}
                    >
                        <BsArrowLeft size={22} className={styles.buttonIconLeft} />
                        Previous
                    </Button>
                )}
                {activeGroupIndex!==questionGroups.length-1 && (
                    <Button 
                        className={cs(styles.button, styles.buttonNext)} 
                        onClick={handleNextClick}
                    >
                        Next
                        <BsArrowRight size={22} className={styles.buttonIconRight} />
                    </Button>
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

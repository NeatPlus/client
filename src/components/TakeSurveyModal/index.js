import {useCallback} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';

import styles from './styles.scss';

const TakeSurveyModal = (props) => {
    const history = useHistory();
    const {projectId} = useParams();

    const {isVisible, onComplete, onClose} = props;

    const handleTakeSurvey = useCallback(()=>{
        // TODO:- Take Survey and get survey id
        const surveyId = 1;
        onClose && onClose();
        onComplete ? onComplete() : history.push(`/projects/${projectId}/surveys/${surveyId}/`);
    }, [onClose, onComplete, history, projectId]);
    
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
            <div className={styles.content}>
                <div className={styles.buttons}>
                    <Button secondary className={styles.button} onClick={onClose}>Cancel</Button>
                    <Button className={styles.button} onClick={handleTakeSurvey}>Create</Button>
                </div>
            </div>

        </Modal>
    );
};

export default TakeSurveyModal;

import {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';

import styles from './styles.scss';

const TakeSurveyModal = (props) => {
    const history = useHistory();
    const {isVisible, onClose} = props;

    const handleTakeSurvey = useCallback(()=>{
        // TODO:- Take Survey
        onClose && onClose();
        history.push('/surveys/dashboard');
    }, [onClose, history]);
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

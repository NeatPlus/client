import {useCallback} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {MdClose} from 'react-icons/md';
import {BsArrowLeft, BsArrowRight} from 'react-icons/bs';
import {RiSkipBackLine, RiSkipForwardLine} from 'react-icons/ri';

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
                <div className={styles.languageSelect}>English</div>
                <h3 className={styles.contentTitle}>Welcome to the NEAT+</h3>
                <div className={styles.contentBlock}>
                    <p className={styles.contentBlockTitle}>
                        Welcome to the activity modules of the NEAT+
                    </p>
                    <p className={styles.contentBlockText}>
                        The activity modules assesses potential environmental risks of planned projects. This survey consists of three seperate modules: Shelter and Infrastructure, WASH, and Food Security. Within each of these modules, you can select the sub-module(s) most relevant to your planned activites.
                    </p>
                </div>
                <div className={styles.contentBlock}>
                    <p className={styles.contentBlockTitle}>Shelter sub-modules</p>
                    <ul className={styles.contentBlockText}>
                        <li>Shelter (Siting)</li>
                        <li>Shelter (Design)</li>
                        <li>Shelter (Materials)</li>
                        <li>Shelter (Construction)</li>
                        <li>Household Items</li>
                        <li>Energy</li>
                        <li>Roads and Access</li>
                    </ul>
                </div>
                <div className={styles.buttons}>
                    <Button secondary className={styles.button} onClick={onClose}>
                        <BsArrowLeft size={22} className={styles.buttonIconLeft} />
                        Previous
                    </Button>
                    <Button className={styles.button} onClick={handleTakeSurvey}>
                        Next
                        <BsArrowRight size={22} className={styles.buttonIconRight} />
                    </Button>
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.footerLink}>
                    <RiSkipBackLine size={20} className={styles.footerLinkIconLeft} />
                    Back to the beginning
                </div>
                <div className={styles.footerLink}>
                    Go to the end
                    <RiSkipForwardLine size={20} className={styles.footerLinkIconRight} />
                </div>
            </div>
        </Modal>
    );
};

export default TakeSurveyModal;

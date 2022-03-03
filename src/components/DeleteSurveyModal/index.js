import {useCallback} from 'react';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import trash from 'assets/images/trash.png';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import useRequest from 'hooks/useRequest';
import Api from 'services/api';
import Toast from 'services/toast';

import styles from './styles.scss';

const DeleteSurveyModal = (props) => {
    const {isVisible, onClose, surveyId} = props;
    const [{loading}, deleteSurvey] = useRequest(`/survey/${surveyId}/`, {
        method: 'DELETE',
    });

    const handleDeleteProject = useCallback(async () => {
        try {
            const result = await deleteSurvey();
            if (result) {
                Api.getSurveys();
                onClose();
                Toast.show(_('Survey successfully deleted!'), Toast.SUCCESS);
            }
        } catch (error) {
            console.log(error);
            onClose();
            Toast.show(error?.detail || _('Something Went Wrong!'), Toast.DANGER);
        }
    }, [deleteSurvey, onClose]);

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Delete Survey</Localize></h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.deleteContent}>
                    <img
                        className={styles.deleteImage}
                        src={trash}
                        alt='trash bin'
                    />
                    <p className={styles.deleteText}>
                        <Localize>Are you sure you want to delete the survey?</Localize>
                    </p>
                </div>
                <div className={styles.buttons}>
                    <Button onClick={onClose} type='button' secondary>
                        <Localize>Cancel</Localize>
                    </Button>
                    <Button loading={loading} onClick={handleDeleteProject}>
                        <Localize>Delete</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteSurveyModal;

import {useCallback} from 'react';
import { useSelector } from 'react-redux';
import {MdClose} from 'react-icons/md';
import { useParams } from 'react-router-dom';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import TextInput from '@ra/components/Form/TextInput';
import Form, {InputField} from '@ra/components/Form';
import {Localize} from '@ra/components/I18n';

import {_} from 'services/i18n';
import Toast from 'services/toast';
import ApiService from 'services/api';

import usePromise from '@ra/hooks/usePromise';
import { getErrorMessage } from '@ra/utils/error';

import styles from './styles.scss';

const CreateSurveyModal = props => {
    const {
        isVisible,
        onClose,
        clone,
        onSurveyCreateComplete,
    } = props;

    const {projectId} = useParams();

    const [{loading}, createDraftSurvey] = usePromise(ApiService.createSurvey);
    const {modules} = useSelector(state => state.context);

    const handleCreateSurvey = useCallback(async ({title}) => {
        try {
            const sensitivityModuleId = modules.find(module => module.code === 'sens')?.id;
            const surveyResponse = await createDraftSurvey({projectId, title, modules: [sensitivityModuleId]});
            const {modules: surveyModules, ...survey} = surveyResponse;
            onSurveyCreateComplete(survey, surveyModules[0]);
        } catch(err) {
            console.log(err);
            Toast.show(getErrorMessage(err), Toast.ERROR);
        }
    }, [createDraftSurvey, projectId, modules, onSurveyCreateComplete]);

    if(!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {clone ? _('Name the new survey') : _('Take a survey')}
                </h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <Form onSubmit={handleCreateSurvey} className={styles.content}>
                <InputField 
                    name="title"
                    required
                    component={TextInput}
                    className={styles.input}
                    label={_('Survey Name')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                />
                <div className={styles.buttons}>
                    <Button 
                        type="button" 
                        secondary 
                        className={styles.button} 
                        onClick={onClose}
                    >
                        <Localize>Cancel</Localize>
                    </Button>
                    <Button 
                        loading={loading} 
                        className={styles.button}
                    >
                        <Localize>Continue</Localize>
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateSurveyModal;

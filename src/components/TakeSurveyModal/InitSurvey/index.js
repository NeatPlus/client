import {useCallback} from 'react';
import {MdClose} from 'react-icons/md';
import {useDispatch} from 'react-redux';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import TextInput from '@ra/components/Form/TextInput';
import Form, {InputField} from '@ra/components/Form';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import * as draftActions from 'store/actions/draft';

import styles from './styles.scss';

const InitSurvey = props => {
    const {
        questionsStatus,
        isVisible,
        onClose,
        clone,
    } = props;

    const dispatch = useDispatch();

    const handleSetSurveyTitle = useCallback(({title}) => 
        dispatch(draftActions.setTitle(title)), 
    [dispatch]
    );

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
            <Form onSubmit={handleSetSurveyTitle} className={styles.content}>
                <InputField 
                    name="title"
                    required
                    component={TextInput}
                    className={styles.input}
                    label={_('Name')}
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
                        loading={questionsStatus!=='complete'} 
                        className={styles.button}
                        onClick={handleSetSurveyTitle}
                    >
                        <Localize>Continue</Localize>
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default InitSurvey;

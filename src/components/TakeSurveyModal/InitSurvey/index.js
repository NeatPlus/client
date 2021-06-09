import {useCallback} from 'react';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import TextInput from '@ra/components/Form/TextInput';
import Form, {InputField} from '@ra/components/Form';

import styles from './styles.scss';

const InitSurvey = props => {
    const {
        questionsStatus,
        isVisible,
        setSurveyTitle,
        onClose,
    } = props;

    const handleSetSurveyTitle = useCallback(({title}) => 
        setSurveyTitle(title), 
    [setSurveyTitle]
    );

    if(!isVisible) {
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
            <Form onSubmit={handleSetSurveyTitle} className={styles.content}>
                <InputField 
                    name="title"
                    required
                    component={TextInput}
                    className={styles.input}
                    label="Name"
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
                        Cancel
                    </Button>
                    <Button 
                        loading={questionsStatus!=='complete'} 
                        className={styles.button}
                        onClick={handleSetSurveyTitle}
                    >
                        Continue
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default InitSurvey;

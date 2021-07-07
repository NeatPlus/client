import React, {useCallback, useState} from 'react';
import {MdClose} from 'react-icons/md';
import {FiChevronLeft} from 'react-icons/fi';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import TextInput from '@ra/components/Form/TextInput';
import Form, {InputField} from '@ra/components/Form';
import withVisibleCheck from '@ra/components/WithVisibleCheck';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import Toast from 'services/toast';
import Api from 'services/api';

import styles from './styles.scss';

const AddEditOrganizationModal = (props) => {
    const {onClose, onGoBack, editMode, organization} = props;
    const [error, setError] = useState(null);

    const [{loading}, createEditOrganization] = usePromise(
        editMode ? Api.editOrganization : Api.createOrganization
    );

    const handleSaveOrganization = useCallback(async inputData => {
        try {
            const org = await createEditOrganization(inputData, organization?.id);
            if(org) {
                Toast.show(
                    editMode 
                        ? 'Organization sucessfully edited' 
                        : 'Request to create organization has been made!', 
                    Toast.SUCCESS
                );
                onClose && onClose();
            }
        } catch (err) {
            setError(err);
            console.log(err);
        }
    }, [onClose, createEditOrganization, editMode, organization]);

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                {onGoBack && (
                    <FiChevronLeft 
                        size={28} 
                        className={styles.backIcon} 
                        onClick={onGoBack} 
                    />
                )}
                <h2 className={styles.title}>
                    {editMode ? 'Edit Organization' : 'Request to add an organization'}
                </h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <Form
                error={error}
                formErrorClassName={styles.error}
                className={styles.content}
                onSubmit={handleSaveOrganization}
            >
                <InputField
                    name='title'
                    required
                    component={TextInput}
                    className={styles.input}
                    label='Name'
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={organization?.title || ''}
                />
                <InputField
                    name='description'
                    component='textarea'
                    className={cs(styles.input, styles.inputArea)}
                    rows={4}
                    cols={5}
                    label='Description'
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={organization?.description || ''}
                />
                {!editMode && (
                    <InputField
                        name="pointOfContact"
                        component={TextInput}
                        className={styles.input}
                        label="Point of Contact"
                        labelClassName={styles.inputLabel}
                        containerClassName={styles.inputGroup}
                    />
                )}
                <div className={styles.buttons}>
                    <Button
                        type='button'
                        secondary
                        className={styles.button}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button loading={loading} className={styles.button}>
                        {editMode ? 'Save' : 'Submit'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default withVisibleCheck(AddEditOrganizationModal);

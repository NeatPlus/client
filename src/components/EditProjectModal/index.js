import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import RadioInput from 'components/Inputs/RadioInput';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import TextInput from '@ra/components/Form/TextInput';
import SelectInput from '@ra/components/Form/SelectInput';
import Form, {InputField} from '@ra/components/Form';

import cs from '@ra/cs';
import useRequest from 'hooks/useRequest';
import Toast from 'services/toast';
import Api from 'services/api';

import styles from './styles.scss';

const keyExtractor = (item) => item.id;
const valueExtractor = (item) => item.title;
const fieldValueExtractor = (val) => val.option;

const EditProjectModal = (props) => {
    const {isVisible, onClose, project} = props;
    const [error, setError] = useState(null);
    const [visibility, setVisibility] = useState(project.visibility);
    const [orgId, setOrgId] = useState(0);

    const {organizations} = useSelector((state) => state.organization);

    useEffect(() => {
        const organization = organizations.filter(
            (org) => org.title === project.organization
        );
        setOrgId(organization[0]?.id);
    }, [organizations, project.organization]);

    const [{loading}, editProject] = useRequest(`/project/${project.id}/`, {
        method: 'PATCH',
    });

    const handleVisibilitySelect = useCallback(
        (value) => setVisibility(value),
        []
    );

    const handleEditProject = useCallback(
        async (formData) => {
            const {title, organization, description} = formData;
            try {
                const result = await editProject({
                    title,
                    organization: organization.id,
                    description,
                    visibility,
                });
                if (result) {
                    onClose();
                    Toast.show('Project successfully Edited!', Toast.SUCCESS);
                    Api.getProjects();
                }
            } catch (err) {
                setError(err);
                console.log(err);
            }
        },
        [visibility, editProject, onClose]
    );

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Edit project</h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <Form
                error={error}
                formErrorClassName={styles.error}
                className={styles.content}
                onSubmit={handleEditProject}
            >
                <InputField
                    name='title'
                    required
                    component={TextInput}
                    className={styles.input}
                    label='Name'
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={project.title}
                />
                <InputField
                    name='organization'
                    component={SelectInput}
                    className={cs(styles.input, styles.inputSelect)}
                    label='Organization'
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    fieldValueExtractor={fieldValueExtractor}
                    options={organizations}
                    placeholder=''
                    valueExtractor={valueExtractor}
                    keyExtractor={keyExtractor}
                    clearable={false}
                    controlClassName={styles.selectControl}
                    defaultValue={orgId}
                />
                <InputField
                    name='description'
                    required
                    component='textarea'
                    className={cs(styles.input, styles.inputArea)}
                    rows={4}
                    cols={5}
                    label='Description'
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={project.description}
                />
                <div className={styles.inputGroup}>
                    {/* TODO: Info Icon */}
                    <Label className={styles.inputLabel}>Visibility</Label>
                    <div className={styles.radioInputs}>
                        <RadioInput
                            onCheck={handleVisibilitySelect}
                            className={styles.radioInput}
                            value='public'
                            label='Public'
                            checked={visibility === 'public'}
                        />
                        <RadioInput
                            onCheck={handleVisibilitySelect}
                            className={styles.radioInput}
                            value='public_within_organization'
                            label='Public within organization'
                            checked={
                                visibility === 'public_within_organization'
                            }
                        />
                        <RadioInput
                            onCheck={handleVisibilitySelect}
                            className={styles.radioInput}
                            value='private'
                            label='Private'
                            checked={visibility === 'private'}
                        />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Users</Label>
                    {/* TODO: Multi-Select Input */}
                    <SelectInput
                        placeholder='Select Users'
                        className={cs(styles.input, styles.inputSelect)}
                    />
                </div>
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
                        Edit
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditProjectModal;

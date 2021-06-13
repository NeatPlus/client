import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
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

const CreateEditProjectModal = (props) => {
    const {isVisible, onClose, project, mode} = props;
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('');
    const [title, setTitle] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [orgObj, setOrgObj] = useState({});
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();

    const {organizations} = useSelector((state) => state.organization);
    const [{loading}, createOrEditProject] = useRequest(url, {
        method: method,
    });

    useEffect(() => {
        if (mode === 'create') {
            setUrl('/project/');
            setMethod('POST');
            setVisibility('private');
            setTitle('Create a project');
            setButtonText('Create');
        }
        if (project && mode === 'edit') {
            const organization = organizations.filter(
                (org) => org.title === project.organization
            );
            setOrgObj(organization[0]);
            setUrl(`/project/${project.id}/`);
            setMethod('PATCH');
            setProjectTitle(project.title);
            setDescription(project.description);
            setOrgObj(organization[0]);
            setVisibility(project.visibility);
            setTitle('Edit project');
            setButtonText('Edit');
        }
    }, [mode, project, organizations]);

    const handleVisibilitySelect = useCallback(
        (value) => setVisibility(value),
        []
    );

    const handleProjectSubmit = useCallback(
        async (formData) => {
            const {title, organization, description} = formData;
            const body = {
                title,
                organization: organization.id,
                description,
                visibility,
            };

            if (mode === 'create') {
                body.context = 1; // FIXME: Use context from api
            }

            try {
                const result = await createOrEditProject(body);
                if (result && mode === 'create') {
                    Toast.show('Project successfully Created!', Toast.SUCCESS);
                    Api.getProjects();
                    history.push(`/projects/${result.id}/`);
                }

                if (result && mode === 'edit') {
                    onClose();
                    Toast.show('Project successfully Edited!', Toast.SUCCESS);
                    Api.getProjects();
                }
            } catch (err) {
                setError(err);
                console.log(err);
            }
        },
        [visibility, createOrEditProject, onClose, history, mode]
    );

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <Form
                error={error}
                formErrorClassName={styles.error}
                className={styles.content}
                onSubmit={handleProjectSubmit}
            >
                <InputField
                    name='title'
                    required
                    component={TextInput}
                    className={styles.input}
                    label='Name'
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={projectTitle}
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
                    defaultValue={orgObj}
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
                    defaultValue={description}
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
                        {buttonText}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateEditProjectModal;

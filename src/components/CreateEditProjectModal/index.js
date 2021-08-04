import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import RadioInput from 'components/Inputs/RadioInput';
import UserOptionLabel, {UserIcon} from 'components/UserOptionLabel';

import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import TextInput from '@ra/components/Form/TextInput';
import SelectInput from '@ra/components/Form/SelectInput';
import MultiSelectInput from '@ra/components/Form/MultiSelectInput';
import Form, {InputField} from '@ra/components/Form';
import withVisibleCheck from '@ra/components/WithVisibleCheck';

import cs from '@ra/cs';
import useRequest from 'hooks/useRequest';
import Toast from 'services/toast';
import Api from 'services/api';

import styles from './styles.scss';

const keyExtractor = (item) => item.id;
const valueExtractor = (item) => item.title;
const userValueExtractor = (item) => `${item.firstName} ${item.lastName}`;
const fieldValueExtractor = (val) => val.option;

const CreateEditProjectModal = (props) => {
    const {onClose, project, mode} = props;
    const [error, setError] = useState(null);
    const [visibility, setVisibility] = useState('');
    const [orgObj, setOrgObj] = useState();
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('');
    const [title, setTitle] = useState('');

    const history = useHistory();

    const {organizations} = useSelector(state => state.organization);
    const {contexts} = useSelector(state => state.context);

    const [{loading}, createOrEditProject] = useRequest(url, {
        method: method,
    });
    const [{data: projectUsers}, getProjectUsers] = useRequest(
        `/project/${project?.id}/users/`,
    );
    const [{loading: loadingUsers, data: users}, getUsers] = useRequest(
        '/user/',
    );

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    useEffect(() => {
        if(mode==='edit') {
            getProjectUsers();
        }
    }, [mode, getProjectUsers]);

    useEffect(() => {
        if (mode === 'create') {
            setUrl('/project/');
            setMethod('POST');
            setVisibility('private');
            setTitle('Create a project');
        }
        if (mode === 'edit' && project) {
            setUrl(`/project/${project?.id}/`);
            setMethod('PATCH');
            setVisibility(project?.visibility);
            setTitle('Edit project');
        }
    }, [mode, project, project?.id, project?.visibility]);

    useEffect(() => {
        const organization = organizations?.find(
            org => org.id === project?.organization
        );
        setOrgObj(organization);
    }, [organizations, project?.organization]);

    const handleVisibilitySelect = useCallback(
        (value) => setVisibility(value),
        []
    );

    const initialUsers = useMemo(() =>
        projectUsers?.map(p => ({id: p.user.id, firstName: p.user.firstName, lastName: p.user.lastName, mode: p.permission})) || []
    , [projectUsers]);

    const handleProjectSubmit = useCallback(
        async (formData) => {
            setError(null);
            const {title, organization, description, users} = formData;
            if(!organization?.id && visibility==='public_within_organization') {
                return setError(
                    new Error('Visibility cannot be \'Public within organization\' with no organization selected')
                );
            } 
            const body = {
                title,
                organization: organization?.id,
                description,
                visibility,
            };

            const userIds = users.map(u => u.id);
            const removedUsers = initialUsers?.filter(u => !userIds.includes(u.id));

            if (mode === 'create') {
                const ctx = contexts.find(el => el.code === 'urban');
                body.context = ctx.id;
            }

            try {
                if(removedUsers.length) {
                    await Api.removeUsers(project?.id, removedUsers.map(u => ({user: parseInt(u.id)})));
                }
                const result = await createOrEditProject(body);
                if(users.length) {
                    await Api.upsertUsers(result?.id, users.map(u => ({user: parseInt(u.id), permission: u.mode})));
                }
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
        [
            visibility, 
            createOrEditProject, 
            onClose, 
            history, 
            mode, 
            initialUsers, 
            project?.id,
            contexts,
        ]
    );

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
                    defaultValue={mode === 'edit' ? project.title : ''}
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
                    placeholder='Select An Organization'
                    valueExtractor={valueExtractor}
                    keyExtractor={keyExtractor}
                    clearable={false}
                    controlClassName={styles.selectControl}
                    defaultValue={mode === 'edit' ? orgObj : {}}
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
                    defaultValue={mode === 'edit' ? project.description : ''}
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
                <InputField
                    name="users"
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    component={MultiSelectInput}
                    controlClassName={styles.multiSelect}
                    placeholder='Select Users'
                    keyExtractor={keyExtractor}
                    valueExtractor={userValueExtractor}
                    defaultValue={initialUsers}
                    loading={loadingUsers}
                    label='Users'
                    renderOptionLabel={UserOptionLabel}
                    renderControlLabel={UserIcon}
                    options={users?.results}
                />
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
                        {mode === 'edit' ? 'Edit' : 'Create'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default withVisibleCheck(CreateEditProjectModal);

import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import RadioInput from 'components/Inputs/RadioInput';
import TextareaInput from 'components/Inputs/TextAreaInput';
import UserOptionLabel, {UserIcon} from 'components/UserOptionLabel';

import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import TextInput from '@ra/components/Form/TextInput';
import SelectInput from '@ra/components/Form/SelectInput';
import MultiSelectInput from '@ra/components/Form/MultiSelectInput';
import Form, {InputField} from '@ra/components/Form';
import withVisibleCheck from '@ra/components/WithVisibleCheck';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import useRequest from 'hooks/useRequest';
import Toast from 'services/toast';
import Api from 'services/api';

import styles from './styles.scss';

const orgKeyExtractor = (item) => item.id;
const userKeyExtractor = (item) => item.username;
const orgValueExtractor = (item) => item?.level > 0?'\u00A0'.repeat(item.level*8)+item.title:item?.title;
const userValueExtractor = (item) => `${item.firstName} ${item.lastName}`;
const fieldValueExtractor = (val) => val.option;

const CreateEditProjectModal = (props) => {
    const {onClose, onComplete, project, mode} = props;
    const [error, setError] = useState(null);
    const [searchValue, setSearchvalue] = useState('');
    const [visibility, setVisibility] = useState('');
    const [orgObj, setOrgObj] = useState({});
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('');

    const history = useHistory();

    const {organizations} = useSelector(state => state.organization);
    const {contexts} = useSelector(state => state.context);
    const {user} = useSelector(state => state.auth);

    const [{loading}, createOrEditProject] = useRequest(url, {
        method: method,
    });
    const [{data: projectUsers}, getProjectUsers] = useRequest(
        `/project/${project?.id}/users/`,
    );
    const [{loading: loadingUsers, result: users}, getUsers] = usePromise(Api.getUsers);

    useEffect(() => {
        getUsers(searchValue);
    }, [getUsers, searchValue]);

    useEffect(() => {
        if(mode==='edit') {
            getProjectUsers();
        }
    }, [mode, getProjectUsers]);

    const title = useMemo(() => {
        if(mode==='create') {
            return _('Create a project');
        } else {
            return _('Edit project');
        }
    }, [mode]);

    useEffect(() => {
        if (mode === 'create') {
            setUrl('/project/');
            setMethod('POST');
            setVisibility('private');
        }
        if (mode === 'edit' && project) {
            setUrl(`/project/${project?.id}/`);
            setMethod('PATCH');
            setVisibility(project?.visibility);
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
        projectUsers?.map(p => ({username: p.user.username, firstName: p.user.firstName, lastName: p.user.lastName, mode: p.permission})) || []
    , [projectUsers]);

    const FilterEmptyComponent = useCallback(
        () => {
            if(searchValue?.length < 3) {
                return <Localize>Please enter more than 3 characters to search</Localize>;
            }
            else {
                return <Localize>No result found for given input</Localize>;
            }
        }, [searchValue]);

    const handleProjectSubmit = useCallback(
        async (formData) => {
            setError(null);
            const {title, organization, description, users} = formData;
            if(!organization?.id && visibility==='public_within_organization') {
                return setError(
                    new Error(_('Visibility cannot be \'Public within organization\' with no organization selected'))
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
                    await Api.removeUsers(project?.id, removedUsers.map(u => ({user: u.username})));
                }
                const result = await createOrEditProject(body);
                if(users.length) {
                    await Api.upsertUsers(result?.id, users.map(u => ({user: u.username, permission: u.mode})));
                }
                if (result && mode === 'create') {
                    Toast.show(_('Project successfully Created!'), Toast.SUCCESS);
                    onComplete();
                    history.push(`/projects/${result.id}/`);
                }

                if (result && mode === 'edit') {
                    onComplete();
                    onClose();
                    Toast.show(_('Project successfully Edited!'), Toast.SUCCESS);
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
            onComplete
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
                    label={_('Name')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={mode === 'edit' ? project.title : ''}
                />
                <InputField
                    name='organization'
                    clearable
                    component={SelectInput}
                    className={cs(styles.input, styles.inputSelect)}
                    label={_('Organization')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    fieldValueExtractor={fieldValueExtractor}
                    options={organizations}
                    placeholder={_('Select An Organization')}
                    valueExtractor={orgValueExtractor}
                    keyExtractor={orgKeyExtractor}
                    controlClassName={styles.selectControl}
                    defaultValue={mode === 'edit' ? orgObj : undefined}
                />
                <InputField
                    name='description'
                    required
                    component={TextareaInput}
                    className={cs(styles.input, styles.inputArea)}
                    label={_('Description')}
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    defaultValue={mode === 'edit' ? project.description : undefined}
                />
                <div className={styles.inputGroup}>
                    {/* TODO: Info Icon */}
                    <Label className={styles.inputLabel}>
                        <Localize>Visibility</Localize>
                    </Label>
                    <div className={styles.radioInputs}>
                        <RadioInput
                            onCheck={handleVisibilitySelect}
                            className={styles.radioInput}
                            value='public'
                            label={_('Public')}
                            checked={visibility === 'public'}
                        />
                        <RadioInput
                            onCheck={handleVisibilitySelect}
                            className={styles.radioInput}
                            value='public_within_organization'
                            label={_('Public within organization')}
                            checked={
                                visibility === 'public_within_organization'
                            }
                        />
                        <RadioInput
                            onCheck={handleVisibilitySelect}
                            className={styles.radioInput}
                            value='private'
                            label={_('Private')}
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
                    optionsWrapperClassName={styles.multiSelectOptionsWrapper}
                    placeholder={_('Select Users')}
                    keyExtractor={userKeyExtractor}
                    valueExtractor={userValueExtractor}
                    defaultValue={initialUsers}
                    loading={loadingUsers}
                    label={_('Users')}
                    renderOptionLabel={UserOptionLabel}
                    renderControlLabel={UserIcon}
                    options={users?.results?.filter(usr => usr.username !== user.username) || []}
                    onInputChange={setSearchvalue}
                    FilterEmptyComponent={FilterEmptyComponent}
                    EmptyComponent={FilterEmptyComponent}
                />
                <div className={styles.buttons}>
                    <Button
                        type='button'
                        secondary
                        className={styles.button}
                        onClick={onClose}
                    >
                        <Localize>Cancel</Localize>
                    </Button>
                    <Button loading={loading} className={styles.button}>
                        {mode === 'edit' ? _('Edit') : _('Create')}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default withVisibleCheck(CreateEditProjectModal);

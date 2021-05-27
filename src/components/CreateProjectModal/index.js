import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import RadioInput from 'components/RadioInput';
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

const keyExtractor = item => item.id;
const valueExtractor = item => item.title;
const fieldValueExtractor = val => val.option;

const CreateProjectModal = props => {
    const {isVisible, onClose} = props;

    const {organizations} = useSelector(state => state.organization);

    const history = useHistory();
    const [{loading}, createProject] = useRequest('/project/', {method: 'POST'});

    const [error, setError] = useState(null);

    const [visibility, setVisibility] = useState('private');
    const handleVisibilitySelect = useCallback(value => setVisibility(value), []);

    const handleCreateProject = useCallback(async (formData) => {
        const {title, organization, description} = formData;
        try {
            const result = await createProject({
                context: 1, // FIXME: Use context from api
                title, 
                organization: organization.id, 
                description, 
                visibility
            });
            if(result) {
                Toast.show('Project successfully created!', Toast.SUCCESS);
                Api.getProjects();
            }
            history.push(`/projects/${result.id}/`);
        } catch(err) {
            setError(err);
            console.log(err);
        }
    }, [visibility, createProject, history]);

    if(!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Create a project</h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div> 
            <Form 
                error={error}
                formErrorClassName={styles.error}
                className={styles.content} 
                onSubmit={handleCreateProject}
            >
                <InputField 
                    name="title"
                    required
                    component={TextInput}
                    className={styles.input}
                    label="Name"
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                />
                <InputField
                    name="organization"
                    component={SelectInput}
                    className={cs(styles.input, styles.inputSelect)}
                    label="Organization"
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                    fieldValueExtractor={fieldValueExtractor}
                    options={organizations}
                    placeholder=""
                    valueExtractor={valueExtractor}
                    keyExtractor={keyExtractor}
                    clearable={false}
                    controlClassName={styles.selectControl}
                />
                <InputField 
                    name="description"
                    required
                    component="textarea"
                    className={cs(styles.input, styles.inputArea)}
                    rows={4}
                    cols={5}
                    label="Description"
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                />
                <div className={styles.inputGroup}>
                    {/* TODO: Info Icon */}
                    <Label className={styles.inputLabel}>Visibility</Label>
                    <div className={styles.radioInputs}>
                        <RadioInput 
                            onCheck={handleVisibilitySelect} 
                            className={styles.radioInput} 
                            value="public" 
                            label="Public" 
                            checked={visibility==='public'}
                        />
                        <RadioInput 
                            onCheck={handleVisibilitySelect} 
                            className={styles.radioInput} 
                            value="public_org" 
                            label="Public within organization" 
                            checked={visibility==='public_org'}
                        />
                        <RadioInput 
                            onCheck={handleVisibilitySelect} 
                            className={styles.radioInput} 
                            value="private" 
                            label="Private" 
                            checked={visibility==='private'}
                        />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>Users</Label>
                    {/* TODO: Multi-Select Input */}
                    <SelectInput 
                        placeholder="Select Users" 
                        className={cs(styles.input, styles.inputSelect)} 
                    />
                </div>
                <div className={styles.buttons}>
                    <Button type="button" secondary className={styles.button} onClick={onClose}>Cancel</Button>
                    <Button loading={loading} className={styles.button}>Create</Button>
                </div>
            </Form>
        </Modal>
    );  
};

export default CreateProjectModal;

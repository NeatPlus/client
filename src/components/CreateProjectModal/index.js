import {useCallback, useState} from 'react';
import {MdClose} from 'react-icons/md';

import Form, {InputField} from '@ra/components/Form';

import Button from 'components/Button';
import RadioInput from 'components/RadioInput';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import TextInput from '@ra/components/Form/TextInput';
import SelectInput from '@ra/components/Form/SelectInput';

import cs from '@ra/cs';

import styles from './styles.scss';

const CreateProjectModal = props => {
    const {isVisible, onClose} = props;

    const [visibility, setVisibility] = useState(null);

    const handleVisibilitySelect = useCallback(value => setVisibility(value), []);

    const handleCreateProject = useCallback((formData) => {
        console.log(formData);
        // TODO: Create Project and Get Project Id
    }, []);

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
            <Form className={styles.content} onSubmit={handleCreateProject}>
                <InputField 
                    name="name"
                    component={TextInput}
                    className={styles.input}
                    label="Name"
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                />
                <InputField 
                    name="organization"
                    component={TextInput}
                    className={styles.input}
                    label="Organization"
                    labelClassName={styles.inputLabel}
                    containerClassName={styles.inputGroup}
                />                
                <InputField 
                    name="description"
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
                    <Button className={styles.button}>Create</Button>
                </div>
            </Form>
        </Modal>
    );  
};

export default CreateProjectModal;

import {useCallback, useState} from 'react';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import TextInput from '@ra/components/Form/TextInput';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import useRequest from 'hooks/useRequest';
import Toast from 'services/toast';

import styles from './styles.scss';

const CloneProjectModal = (props) => {
    const {isVisible, onClose, project, onClone} = props;
    const [{loading}, cloneProject] = useRequest('/project/', {
        method: 'POST',
    });
    const [inputData, setInputData] = useState({
        title: `Copy of ${project.title}`,
    });

    const handleChange = useCallback(
        ({name, value}) =>
            setInputData({
                ...inputData,
                [name]: value,
            }),
        [inputData]
    );

    const closeThisModal = useCallback(() => {
        onClose();
        setInputData({
            title: `Copy of ${project.title}`,
        });
    }, [onClose, project.title]);

    const handleCloneProject = useCallback(async () => {
        try {
            const result = await cloneProject({
                context: project.context,
                title: inputData.title,
                organization: project.organization,
                description: project.description,
                visibility: project.visibility,
            });
            if (result) {
                onClone && onClone();
                closeThisModal();
                Toast.show(_('Project successfully Cloned!'), Toast.SUCCESS);
            }
        } catch (error) {
            console.log(error);
            closeThisModal();
            Toast.show(_('Something Went Wrong!'), Toast.DANGER);
        }
    }, [
        onClone,
        cloneProject,
        project.context,
        project.description,
        project.visibility,
        project.organization,
        inputData.title,
        closeThisModal,
    ]);

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Clone Project</Localize></h2>
                <div className={styles.closeContainer} onClick={closeThisModal}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>
                        <Localize>Name the Cloned Project</Localize>
                    </Label>
                    <TextInput
                        name='title'
                        onChange={handleChange}
                        className={styles.input}
                        value={inputData.title}
                    />
                </div>
                <div className={styles.buttons}>
                    <Button onClick={closeThisModal} type='button' secondary>
                        <Localize>Cancel</Localize>
                    </Button>
                    <Button loading={loading} onClick={handleCloneProject}>
                        <Localize>Clone</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CloneProjectModal;

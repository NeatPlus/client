import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import TextInput from '@ra/components/Form/TextInput';

import useRequest from 'hooks/useRequest';
import Api from 'services/api';
import Toast from 'services/toast';

import styles from './styles.scss';

const CloneProjectModal = (props) => {
    const {isVisible, onClose, project} = props;
    const {organizations} = useSelector((state) => state.organization);
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
        const organization = organizations.filter(
            (org) => org.title === project.organization
        );
        try {
            const result = await cloneProject({
                context: project.context,
                title: inputData.title,
                organization: organization[0].id,
                description: project.description,
                visibility: project.visibility,
            });
            if (result) {
                Api.getProjects();
                closeThisModal();
                Toast.show('Project successfully Cloned!', Toast.SUCCESS);
            }
        } catch (error) {
            console.log(error);
            closeThisModal();
            Toast.show('Something Went Wrong!', Toast.DANGER);
        }
    }, [
        cloneProject,
        project.context,
        project.description,
        project.visibility,
        project.organization,
        inputData.title,
        organizations,
        closeThisModal,
    ]);

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Clone Project</h2>
                <div className={styles.closeContainer} onClick={closeThisModal}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.inputGroup}>
                    <Label className={styles.inputLabel}>
                        Name the Cloned Project
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
                        Cancel
                    </Button>
                    <Button loading={loading} onClick={handleCloneProject}>
                        Clone
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CloneProjectModal;

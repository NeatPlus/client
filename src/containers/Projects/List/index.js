import {useState, useCallback} from 'react';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import {withNoProject} from 'components/NoProject';
import CreateProjectModal from 'components/CreateProjectModal';

import styles from './styles.scss';

const ProjectList = withNoProject(() => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleShowCreateModal = useCallback(() => setShowCreateModal(true), []);
    const handleHideCreateModal = useCallback(() => setShowCreateModal(false), []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Projects</h1>
                <Button className={styles.button} onClick={handleShowCreateModal}>
                    <BsPlus size={24} className={styles.buttonIcon} /> Create
                </Button>
            </div>
            <div className={styles.content}>
                PROJECT LIST
            </div>
            <CreateProjectModal isVisible={showCreateModal} onClose={handleHideCreateModal} />
        </div>
    );
});

export default ProjectList;

import {useState, useCallback} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import CreateProjectModal from 'components/CreateProjectModal';

import noProjectImage from 'assets/images/no-project.svg';
import projects from 'services/mockData/projects.json';

import styles from './styles.scss';

const NoProject = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleShowCreateModal = useCallback(() => setShowCreateModal(true), []);
    const handleHideCreateModal = useCallback(() => setShowCreateModal(false), []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Projects</h1>
            <main className={styles.content}>
                <div className={styles.createBox}>
                    <img src={noProjectImage} alt="No Projects" className={styles.infoImage} />
                    <p className={styles.infoTextTitle}>Hi User,</p> {/* FIXME: Use actual User's name */} 
                    <p className={styles.infoText}>Let's get started by creating a new project</p>
                    <Button className={styles.button} onClick={handleShowCreateModal}>
                        <BsPlus size={24} className={styles.buttonIcon} /> Create
                    </Button>
                </div>
            </main>
            <CreateProjectModal isVisible={showCreateModal} onClose={handleHideCreateModal} />
        </div>
    );
};

export default NoProject;

export const withNoProject = WrappedComponent => {
    const WithNoProject = (props) => {
        // TODO: Use actual projects

        if(projects.length) {
            return <WrappedComponent {...props} />;
        }

        return <NoProject />;

    };
    return hoistNonReactStatics(WithNoProject, WrappedComponent);
};

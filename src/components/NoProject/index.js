import {useState, useCallback} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {useSelector} from 'react-redux';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import CreateProjectModal from 'components/CreateProjectModal';

import noProjectImage from 'assets/images/no-project.svg';

import styles from './styles.scss';

const NoProject = () => {
    const {user} = useSelector(state => state.auth);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleShowCreateModal = useCallback(() => setShowCreateModal(true), []);
    const handleHideCreateModal = useCallback(() => setShowCreateModal(false), []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Projects</h1>
            <main className={styles.content}>
                <div className={styles.createBox}>
                    <img src={noProjectImage} alt="No Projects" className={styles.infoImage} />
                    <p className={styles.infoTextTitle}>Hi {user.firstName},</p>
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
        const {projects, status} = useSelector(state => state.project);
        if(projects.length) {
            return <WrappedComponent {...props} />;
        }
        if(status!=='complete') {
            return null;
        }

        return <NoProject />;

    };
    return hoistNonReactStatics(WithNoProject, WrappedComponent);
};


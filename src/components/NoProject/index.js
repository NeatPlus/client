import {useState, useCallback} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {useSelector} from 'react-redux';
import {BsPlus} from 'react-icons/bs';

import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import CreateEditProjectModal from 'components/CreateEditProjectModal';
import {Localize} from '@ra/components/I18n';

import noProjectImage from 'assets/images/no-project.svg';

import styles from './styles.scss';

const NoProject = () => {
    const {user} = useSelector((state) => state.auth);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleShowCreateModal = useCallback(
        () => setShowCreateModal(true),
        []
    );
    const handleHideCreateModal = useCallback(
        () => setShowCreateModal(false),
        []
    );

    return (
        <div className={styles.container}>
            <main className={styles.content}>
                <div className={styles.createBox}>
                    <img
                        src={noProjectImage}
                        alt='No Projects'
                        className={styles.infoImage}
                    />
                    <p className={styles.infoTextTitle}><Localize>Hi</Localize> {user.firstName},</p>
                    <p className={styles.infoText}>
                        <Localize>Let's get started by creating a new project</Localize>
                    </p>
                    <Button
                        className={styles.button}
                        onClick={handleShowCreateModal}
                    >
                        <BsPlus size={24} className={styles.buttonIcon} />{' '}
                        <Localize>Create</Localize>
                    </Button>
                </div>
            </main>
            <CreateEditProjectModal
                isVisible={showCreateModal}
                onClose={handleHideCreateModal}
                mode='create'
            />
        </div>
    );
};

export default NoProject;

export const withNoProject = (WrappedComponent) => {
    const WithNoProject = (props) => {
        const {loading, projects} = props;
        if (projects?.length) {
            return <WrappedComponent {...props} />;
        }
        if (loading) {
            return <NeatLoader />;
        }

        return <NoProject />;
    };
    return hoistNonReactStatics(WithNoProject, WrappedComponent);
};

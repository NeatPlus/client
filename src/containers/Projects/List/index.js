import {withNoProject} from 'components/NoProject';
import CreateProjectModal from 'components/CreateProjectModal';

import styles from './styles.scss';

const ProjectList = withNoProject(() => {
    return (
        <div className={styles.container}>
            PROJECT LIST
            <CreateProjectModal />
        </div>
    );
});

export default ProjectList;

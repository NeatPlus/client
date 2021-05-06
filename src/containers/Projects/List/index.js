import {withNoProject} from 'components/NoProject';

import styles from './styles.scss';

const ProjectList = withNoProject(() => {
    <div className={styles.container}>
        PROJECT LIST
    </div>;
});

export default ProjectList;

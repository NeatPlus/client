import hoistNonReactStatics from 'hoist-non-react-statics';

import projects from 'services/mockData/projects.json';

import styles from './styles.scss';

const NoProject = () => {
    return (
        <div className={styles.emptyContent}>
            NO PROJECTS
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


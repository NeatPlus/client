import {useState, useCallback, useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AiOutlineFileText} from 'react-icons/ai';

import FloatingAction from 'components/FloatingAction';
import UserNav from 'components/UserNav';

import cs from '@ra/cs';

import styles from './styles.scss';

const Projects = () => {
    const {projectId, title} = useSelector(state => state.draft);

    const [projectSearchQuery, setProjectSearchQuery] = useState('');
    const handleSearchQueryChange = useCallback(query => {
        localStorage.setItem('projectsPage', 1);
        setProjectSearchQuery(query);
    }, []);

    useEffect(() => {
        return () => localStorage.setItem('projectsPage', 1);
    }, []);

    return (
        <div className={cs(styles.container, 'no-bgcolor')}>
            <UserNav searchQuery={projectSearchQuery} onSearchQueryChange={handleSearchQueryChange} />
            <div className={styles.content}>
                <Outlet context={{projectSearchQuery}} />
            </div>
            {projectId && !!title && (
                <FloatingAction surveyTitle={title} icon={AiOutlineFileText} />
            )}
        </div>
    );
};

export default Projects;

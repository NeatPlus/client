import {useState, useCallback, useEffect} from 'react';
import {Outlet} from 'react-router';

import UserNav from 'components/UserNav';

import cs from '@ra/cs';

import styles from './styles.scss';

const Projects = () => {
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
        </div>
    );
};

export default Projects;

import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {setActiveProject} from 'store/actions/project';
import {getFormattedProjects} from 'store/selectors/project';

const useInitActiveProject = (projectId) => {
    const {projectId: fallbackId} = useParams();

    const dispatch = useDispatch();

    const {status} = useSelector(state => state.project);
    const projects = useSelector(getFormattedProjects);

    useEffect(() => {
        if(status === 'complete') {
            const activeProject = projects?.find(prj => {
                if(projectId) {
                    return prj.id === +projectId;
                }
                return prj.id === +fallbackId;
            });
            dispatch(setActiveProject(activeProject));
        }
    }, [projectId, status, dispatch, projects, fallbackId]);
};

export default useInitActiveProject;

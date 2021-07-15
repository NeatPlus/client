import {useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import usePromise from '@ra/hooks/usePromise';

import Api from 'services/api';
import {setActiveProject} from 'store/actions/project';

const useInitActiveProject = (projectId) => {
    const {projectId: fallbackId} = useParams();

    const dispatch = useDispatch();

    const {status, activeProject, projects} = useSelector(state => state.project);

    const [{result: data}, requestAccessLevel] = usePromise(Api.getProjectAccessLevel);

    const getAccessLevel = useCallback(async projectId => {
        try {
            await requestAccessLevel(projectId);
        } catch (err) {
            console.log(err);
        }
    }, [requestAccessLevel]);

    useEffect(() => {
        if(status==='complete') {
            getAccessLevel(projectId ?? fallbackId);
        }
    }, [getAccessLevel, projectId, status, fallbackId]);

    useEffect(() => {
        if(data && activeProject && activeProject?.accessLevel !== data?.accessLevel) {
            const newActiveProject = {
                ...activeProject, 
                accessLevel: data.accessLevel
            };
            dispatch(setActiveProject(newActiveProject));
        }
    }, [activeProject, data, dispatch]);

    useEffect(() => {
        if(status === 'complete') {
            const project = projects?.find(prj => {
                if(projectId) {
                    return prj.id === +projectId;
                }
                return prj.id === +fallbackId;
            });
            if(project && project?.id !== activeProject?.id) {
                dispatch(setActiveProject(project));
            }
        }
    }, [
        projectId, 
        status, 
        dispatch, 
        projects, 
        fallbackId,
        data,
        activeProject,
    ]);
};

export default useInitActiveProject;

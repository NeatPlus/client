import {useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import usePromise from '@ra/hooks/usePromise';

import Api from 'services/api';
import {setActiveProject} from 'store/actions/project';

const useInitActiveProject = (projectId) => {
    const {projectId: fallbackId} = useParams();

    const dispatch = useDispatch();

    const {activeProject} = useSelector(state => state.project);

    const [{result: accessData}, requestAccessLevel] = usePromise(Api.getProjectAccessLevel);

    const getAccessLevel = useCallback(async projectId => {
        try {
            await requestAccessLevel(projectId);
        } catch (err) {
            console.log(err);
        }
    }, [requestAccessLevel]);

    useEffect(() => {
        getAccessLevel(projectId ?? fallbackId);
    }, [getAccessLevel, projectId, fallbackId]);

    useEffect(() => {
        if(accessData && activeProject && activeProject?.accessLevel !== accessData?.accessLevel) {
            const newActiveProject = {
                ...activeProject, 
                accessLevel: accessData.accessLevel
            };
            dispatch(setActiveProject(newActiveProject));
        }
    }, [activeProject, accessData, dispatch]);

    const addActiveProject = useCallback(async id => {
        try {
            const project = await Api.getProject(id);
            dispatch(setActiveProject(project));
        } catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        addActiveProject(projectId ?? fallbackId);
    }, [projectId, fallbackId, addActiveProject]);
};

export default useInitActiveProject;

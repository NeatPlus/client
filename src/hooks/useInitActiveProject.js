import {useEffect, useCallback, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import usePromise from '@ra/hooks/usePromise';

import Api from 'services/api';
import {setActiveProject} from 'store/actions/project';

const useInitActiveProject = (id) => {
    const {projectId: fallbackId} = useParams();

    const projectId = useMemo(() => id ?? +fallbackId, [id, fallbackId]);

    const dispatch = useDispatch();

    const {activeProject} = useSelector(state => state.project);
    const {surveys, surveyResults} = useSelector(state => state.survey);

    const [{result: accessData}, requestAccessLevel] = usePromise(Api.getProjectAccessLevel);

    const getAccessLevel = useCallback(async projectId => {
        try {
            await requestAccessLevel(projectId);
        } catch (err) {
            console.log(err);
        }
    }, [requestAccessLevel]);

    useEffect(() => {
        getAccessLevel(projectId);
    }, [getAccessLevel, projectId]);

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
        addActiveProject(projectId);
    }, [projectId, addActiveProject]);

    const hasSurveys = useMemo(() => surveys.some(el => el.project === +projectId), [surveys, projectId]); 

    const hasResults = useMemo(() => surveyResults?.length && !surveys.some(sur => {
        return surveyResults.some(res => res.survey !== sur.id);
    }), [surveyResults, surveys]);

    useEffect(() => {
        if(hasSurveys && !hasResults) {
            Api.getSurveyDetails(projectId);
        }
    }, [hasSurveys, hasResults, projectId]);
};

export default useInitActiveProject;

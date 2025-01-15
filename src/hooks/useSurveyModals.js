import {useCallback, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import Api from 'services/api';

const initialState = {
    showCreateSurveyModal: false,
    showTakeSurveyModal: false,
    showDeleteDraftModal: false,
};
const useSurveyModals = (moduleCode) => {
    const {questions} = useSelector(state => state.question);

    const [surveyModals, setSurveyModals] = useState(initialState);
    const [survey, setSurvey] = useState(null);
    const [surveyModuleId, setSurveyModuleId] = useState(null);

    const handleCreateNewSurvey = useCallback(() => {
        setSurveyModals({
            showCreateSurveyModal: true, 
            showTakeSurveyModal: false, 
            showDeleteDraftModal: false
        });
    }, []);

    const handleShowTakeSurvey = useCallback((surveyData, surveyModuleIdData) => {
        console.log('SHOWING TAKE SURVEY', surveyData, surveyModuleIdData);
        setSurvey(surveyData);
        setSurveyModuleId(surveyModuleIdData);
        // if(!questions?.[moduleCode]?.length) {
        //     Api.getQuestions(moduleCode);
        // }
        setSurveyModals({
            showCreateSurveyModal: false,
            showTakeSurveyModal: true,
            showDeleteDraftModal: false,
        });
    }, []);

    const handleShowDeleteDraft = useCallback(() => {
        setSurveyModals({
            showCreateSurveyModal: false,
            showTakeSurveyModal: false,
            showDeleteDraftModal: true,
        });
    }, []);

    const hideModals = useCallback(() => {
        setSurveyModals(initialState);
    }, []);

    useEffect(() => {
        return () => {
            setSurvey(null);
            setSurveyModuleId(null);
        };
    }, []);

    return {
        module: moduleCode,
        surveyModuleId,
        survey,
        surveyModals,
        handleCreateNewSurvey,
        handleShowTakeSurvey,
        handleShowDeleteDraft,
        hideModals,
    };
};

export default useSurveyModals;

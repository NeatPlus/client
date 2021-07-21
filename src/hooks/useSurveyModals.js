import {useCallback, useState, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {initDraftAnswers} from 'utils/dispatch';

const useSurveyModals = (module) => {
    const {projectId} = useParams(); 
    const {projectId: draftId, title} = useSelector(state => state.draft);

    const doesDraftExist = useMemo(() => draftId && title, [draftId, title]);

    const [surveyModals, setSurveyModals] = useState({
        showTakeSurveyModal: false,
        showDeleteDraftModal: false,
    });

    const handleShowTakeSurvey = useCallback((reset=true) => {
        if(reset) {
            initDraftAnswers(+projectId, module);
        }
        setSurveyModals({
            showTakeSurveyModal: true,
            showDeleteDraftModal: false,
        });
    }, [projectId, module]);

    const handleShowDeleteDraft = useCallback(() => {
        if(doesDraftExist) {
            return setSurveyModals({
                showTakeSurveyModal: false,
                showDeleteDraftModal: true,
            });
        }
        handleShowTakeSurvey();
    }, [doesDraftExist, handleShowTakeSurvey]);

    const hideModals = useCallback(() => {
        setSurveyModals({
            showTakeSurveyModal: false,
            showDeleteDraftModal: false,
        });
    }, []);

    return {
        surveyModals,
        handleShowTakeSurvey,
        handleShowDeleteDraft,
        hideModals,
    };
};

export default useSurveyModals;

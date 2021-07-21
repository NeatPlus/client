import {useCallback, useState, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {initDraftAnswers} from 'utils/dispatch';
import Api from 'services/api';

const useSurveyModals = (module) => {
    const {projectId} = useParams(); 
    const {projectId: draftId, title} = useSelector(state => state.draft);
    const {questions} = useSelector(state => state.question);

    const doesDraftExist = useMemo(() => draftId && title, [draftId, title]);

    const [surveyModals, setSurveyModals] = useState({
        showTakeSurveyModal: false,
        showDeleteDraftModal: false,
    });

    const handleShowTakeSurvey = useCallback((reset=true) => {
        if(reset) {
            initDraftAnswers(+projectId, module);
        }
        if(!questions?.[module]?.length) {
            Api.getQuestions(module);
        }
        setSurveyModals({
            showTakeSurveyModal: true,
            showDeleteDraftModal: false,
        });
    }, [projectId, module, questions]);

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

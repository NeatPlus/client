import TakeSurveyModal from 'components/TakeSurveyModal';
import DeleteDraftModal from 'components/DeleteDraftModal';
import CreateSurveyModal from 'components/CreateSurveyModal';

const SurveyModals = ({
    surveyModals: {
        showCreateSurveyModal,
        showTakeSurveyModal,
        showDeleteDraftModal,
    },
    handleShowTakeSurvey,
    hideModals,
    onDelete,
    module,
    survey,
    surveyModuleId
}) => {
    return (
        <>
            <CreateSurveyModal
                isVisible={showCreateSurveyModal}
                onClose={hideModals}
                onSurveyCreateComplete={handleShowTakeSurvey}
            />
            <TakeSurveyModal
                survey={survey}
                surveyModuleId={surveyModuleId}
                isVisible={showTakeSurveyModal} 
                onClose={hideModals}
                moduleCode={module}
            />
            <DeleteDraftModal
                isVisible={showDeleteDraftModal}
                onResume={handleShowTakeSurvey}
                onClose={hideModals}
                onDelete={onDelete ?? handleShowTakeSurvey}
                module={module}
            />
        </>
    );
};

export default SurveyModals;

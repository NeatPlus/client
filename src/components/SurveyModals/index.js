import TakeSurveyModal from 'components/TakeSurveyModal';
import DeleteDraftModal from 'components/DeleteDraftModal';

const SurveyModals = ({
    surveyModals: {
        showTakeSurveyModal,
        showDeleteDraftModal,
    },
    handleShowTakeSurvey,
    hideModals,
    onDelete,
    module,
}) => {
    return (
        <>
            <TakeSurveyModal 
                isVisible={showTakeSurveyModal} 
                onClose={hideModals} 
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

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
}) => {
    return (
        <>
            <TakeSurveyModal 
                isVisible={showTakeSurveyModal} 
                onClose={hideModals} 
            />
            <DeleteDraftModal
                isVisible={showDeleteDraftModal}
                onClose={hideModals}
                onDelete={onDelete ?? handleShowTakeSurvey}
            />
        </>
    );
};

export default SurveyModals;

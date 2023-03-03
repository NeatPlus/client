import React, {useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RiFileList3Line} from 'react-icons/ri';

import TakeSurveyModal from 'components/TakeSurveyModal';
import {Localize} from '@ra/components/I18n';

import * as questionActions from 'store/actions/question';

import styles from './styles.scss';

const ShowQuestionnairesButton = ({
    moduleCode
}) => {
    const dispatch = useDispatch();

    const {activeProject} = useSelector(state => state.project);
    const {activeSurvey} = useSelector(state => state.survey);
    const {questions} = useSelector(state => state.question);

    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
   
    const handleShowQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers(activeSurvey?.answers.map(ans => (
            {...ans, question: ans.question.id}
        )).filter(ans => questions?.[moduleCode]?.some(ques => ques.id === ans.question))));
        setShowQuestionnaire(true);
    }, [activeSurvey, dispatch, questions, moduleCode]);

    const handleCloseQuestionnaire = useCallback(() => {
        dispatch(questionActions.setAnswers([]));
        setShowQuestionnaire(false);
    }, [dispatch]);

    return (
        <>
            <TakeSurveyModal 
                isVisible={showQuestionnaire} 
                editable={false}
                onClose={handleCloseQuestionnaire}
                code={moduleCode}
                isNewEdit={activeProject?.isAdminOrOwner}
            />
            <button
                type="button"
                disabled={!activeSurvey?.answers?.length}
                onClick={handleShowQuestionnaire}
                className={styles.button}
            >
                <RiFileList3Line />
                <span className={styles.buttonText}><Localize>Show Questionnaires</Localize></span>
            </button>
        </>

    );
};

export default ShowQuestionnairesButton;

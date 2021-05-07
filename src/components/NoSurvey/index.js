import {useState, useCallback} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import TakeSurveyModal from 'components/TakeSurveyModal';

import noSurveyImage from 'assets/images/no-survey.svg';
import surveys from 'services/mockData/surveys.json';

import styles from './styles.scss';

const NoSurveys = () => {
    const [showTakeSurveyModal, setShowTakeSurveyModal] = useState(false);
    const handleShowTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(true), []);
    const handleHideTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(false), []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Surveys</h1>
            <main className={styles.content}>
                <div className={styles.takeSurveyBox}>
                    <img src={noSurveyImage} alt="No Surveys" className={styles.infoImage} />
                    <p className={styles.infoText}>No surveys found</p>
                    <Button className={styles.button} onClick={handleShowTakeSurveyModal}>
                        <BsPlus size={24} className={styles.buttonIcon} />Take Survey
                    </Button>
                </div>
            </main>
            <TakeSurveyModal isVisible={showTakeSurveyModal} onClose={handleHideTakeSurveyModal} />
        </div>
    );
};

export default NoSurveys;

export const withNoSurvey = WrappedComponent => {
    const WithNoSurvey = (props) => {
        // TODO:- Use fetched surveys
        if(surveys.length){
            return <WrappedComponent {...props} />;
        }
        return <NoSurveys />;
    };
    return hoistNonReactStatics(WithNoSurvey, WrappedComponent);
};

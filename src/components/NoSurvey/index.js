import {useState, useCallback, useMemo} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {BsPlus} from 'react-icons/bs';
import {BiChevronLeft} from 'react-icons/bi';

import Button from 'components/Button';
import TakeSurveyModal from 'components/TakeSurveyModal';

import useInitActiveProject from 'hooks/useInitActiveProject';
import {checkEditAccess} from 'utils/permission';
import noSurveyImage from 'assets/images/no-survey.svg';

import styles from './styles.scss';

const NoSurveys = () => {
    useInitActiveProject();

    const [showTakeSurveyModal, setShowTakeSurveyModal] = useState(false);

    const {activeProject} = useSelector(state => state.project);

    const hasEditAccess = useMemo(() => checkEditAccess(activeProject?.accessLevel), [activeProject]);

    const handleShowTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(true), []);
    const handleHideTakeSurveyModal = useCallback(() => setShowTakeSurveyModal(false), []);

    return (
        <div className={styles.container}>
            <Link to="/projects" className={styles.backLink}>
                <BiChevronLeft size={22} className={styles.backIcon} /> Back to Projects
            </Link>
            <main className={styles.content}>
                <div className={styles.takeSurveyBox}>
                    <img src={noSurveyImage} alt="No Surveys" className={styles.infoImage} />
                    <p className={styles.infoText}>No surveys found</p>
                    {hasEditAccess && (
                        <Button 
                            className={styles.button} 
                            onClick={handleShowTakeSurveyModal}
                        >
                            <BsPlus size={24} className={styles.buttonIcon} />Take Survey
                        </Button>
                    )}
                </div>
            </main>
            <TakeSurveyModal 
                isVisible={showTakeSurveyModal} 
                onClose={handleHideTakeSurveyModal} 
            />
        </div>
    );
};

export default NoSurveys;

export const withNoSurvey = WrappedComponent => {
    const WithNoSurvey = (props) => {
        const {projectId} = useParams();

        const {surveys, status} = useSelector(state => state.survey);
        const surveyData = surveys.filter(el => el.project === +projectId);

        if(surveyData.length){
            return <WrappedComponent {...props} />;
        }
        if(status!=='complete') {
            return null;
        }
        return <NoSurveys />;
    };
    return hoistNonReactStatics(WithNoSurvey, WrappedComponent);
};

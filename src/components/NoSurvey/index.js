import {useMemo, useState, useCallback} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Tour from 'reactour';

import {BsPlus} from 'react-icons/bs';
import {BiChevronLeft} from 'react-icons/bi';

import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import SurveyModals from 'components/SurveyModals';
import {Localize} from '@ra/components/I18n';

import useInitActiveProject from 'hooks/useInitActiveProject';
import useSurveyModals from 'hooks/useSurveyModals';
import {checkEditAccess} from 'utils/permission';
    
import noSurveyImage from 'assets/images/no-survey.svg';

import styles from './styles.scss';

const NoSurveys = () => {
    useInitActiveProject();
    const surveyModalsConfig = useSurveyModals('sens');

    const {activeProject} = useSelector(state => state.project);

    const hasEditAccess = useMemo(() => checkEditAccess(activeProject?.accessLevel), [activeProject]);

    const stepContent =  `Surveys are individual U-NEAT+ assessments, conducted through a questionnaire.
    Surveys are within projects. To take a survey, simply click on “Take Survey” and go through the questionnaire.
    Please provide a meaningful name. There will be questions to provide more project information later.
    Note that responses are saved continuously in your browser cache – you can skip questions or return to a partially
    completed survey later using the same web browser on the same device. You can find your survey in the bottom-right corner of your screen.`;


    const steps = [{
        'content': stepContent
    }];

    const [isTourOpen, setIsTourOpen] = useState(
        !localStorage.getItem('survey-onboarding')
    );

    const onTourClose = useCallback(() => {
        localStorage.setItem('survey-onboarding', true);
        setIsTourOpen(false);
    }, []);

    return (
        <div className={styles.container}>
            <Link to="/projects" className={styles.backLink}>
                <BiChevronLeft size={22} className={styles.backIcon} /> <Localize>Back to Projects</Localize>
            </Link>
            <main className={styles.content}>
                <div className={styles.takeSurveyBox}>
                    <img src={noSurveyImage} alt="No Surveys" className={styles.infoImage} />
                    <p className={styles.infoText}><Localize>No surveys found</Localize></p>
                    {hasEditAccess && (
                        <>
                            <Button
                                className={styles.button}
                                onClick={surveyModalsConfig.handleShowDeleteDraft}
                            >
                                <BsPlus size={24} className={styles.buttonIcon} /><Localize>Take Survey</Localize>
                            </Button>
                            <Tour
                                closeWithMask={false}
                                steps={steps}
                                isOpen={isTourOpen}
                                lastStepNextButton={<Button>Done</Button>}
                                onRequestClose={onTourClose}
                            />
                        </>
                    )}
                </div>
            </main>
            <SurveyModals {...surveyModalsConfig} />
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
            return <NeatLoader containerClassName={styles.loaderContainer} />;
        }
        return <NoSurveys />;
    };
    return hoistNonReactStatics(WithNoSurvey, WrappedComponent);
};

import {useCallback, useMemo, useEffect, useState} from 'react';
import {useNavigate, useLocation, useParams} from 'react-router';
import {useSelector, useDispatch} from 'react-redux';
import SVG from 'react-inlinesvg';
import {BiChevronLeft} from 'react-icons/bi';
import {BsQuestionCircle} from 'react-icons/bs';

import Button from 'components/Button';
import InfoTooltip from 'components/InfoTooltip';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import useInitActiveProject from 'hooks/useInitActiveProject';
import useInitActiveSurvey from 'hooks/useInitActiveSurvey';

import topicIconPlaceholder from 'assets/icons/topic-icon-placeholder.svg';
import updateConfirmImg from 'assets/images/update-confirm.svg';
import {setAdvancedFeedbacks} from 'store/actions/survey';

import cs from '@ra/cs';
import Api from 'services/api';
import usePromise from '@ra/hooks/usePromise';
import Toast from 'services/toast';
import {getErrorMessage} from '@ra/utils/error';
import {_} from 'services/i18n';

import FeedbackTopicTable from './FeedbackTable';
import styles from './styles.scss';
import CheckboxInput from 'vendor/react-arsenal/components/Form/CheckboxInput';
import ConfirmationModal from 'components/ConfirmationModal';

const keyExtractor = item => item.id;

const TopicItem  = ({item, activeModule, isBaselineFeedback}) => {
    const {statements} = useSelector(state => state.statement);
    const {activeSurvey} = useSelector(state => state.survey);

    const topicStatementResults = useMemo(() => {
        return statements.filter(st => st.topic === item.id).map(tpcSt => {
            return {
                ...tpcSt,
                result: activeSurvey?.results?.find(res => res?.statement === tpcSt.id && res?.module === activeModule?.id),
            };
        });
    }, [statements, item, activeSurvey, activeModule]);

    return (
        <div className={styles.topicItem}>
            <div className={styles.topicHeader}>
                <SVG
                    className={styles.topicIcon}
                    src={item.icon ?? topicIconPlaceholder}
                    width={20}
                    title={item.title}
                >
                    <SVG className={styles.topicIcon} width={20} src={topicIconPlaceholder} title={item.title} />
                </SVG>
                <span className={styles.topicTitle}>{item.title}</span>
            </div>
            <FeedbackTopicTable
                topicStatementResults={topicStatementResults}
                activeModule={activeModule}
                isBaselineFeedback={isBaselineFeedback}
                activeSurvey={activeSurvey}
            />
        </div>
    );
};

const SurveyFeedback = () => {
    useInitActiveProject();
    useInitActiveSurvey();

    const dispatch = useDispatch();
    const {projectId, surveyId} = useParams();

    const {user, isAuthenticated} = useSelector(state => state.auth);
    const {topics} = useSelector(state => state.statement);
    const {modules} = useSelector(state => state.context);
    const {activeProject} = useSelector(state => state.project);
    const {advancedFeedbacks, activeSurvey} = useSelector(state => state.survey);

    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = useCallback(() => navigate(-1), [navigate]);

    const [{loading}, submitFeedbacks] = usePromise(Api.postFeedback);
    const [{loading: baselineLoading}, submitBaselineFeedbacks] = usePromise(Api.addBaselineFeedback);
    const [{loading: updatingResults}, addSurveyResults] = usePromise(Api.addSurveyResults);

    const [shouldUpdateSurveyResults, setShouldUpdateSurveyResults] = useState(false);
    const handleChangeShouldUpdateResults = useCallback(({checked}) => {
        setShouldUpdateSurveyResults(Boolean(checked));
    }, []);

    const [isOverwriteModalVisible, setIsOverwriteModalVisible] = useState(false);
    const handleShowOverwriteModal = useCallback(() => setIsOverwriteModalVisible(true), []);
    const handleHideOverwriteModal = useCallback(() => setIsOverwriteModalVisible(false), []);

    useEffect(() => {
        if(!location?.state?.moduleCode) {
            if(projectId && surveyId) {
                return navigate(`/projects/${projectId}/surveys/${surveyId}/`);
            }
            return navigate('/projects/');
        }
        return () => dispatch(setAdvancedFeedbacks([]));
    }, [location, navigate, dispatch, projectId, surveyId]);

    const isBaselineFeedback = useMemo(() => location?.state?.isBaseline, [location]);

    const activeModule = useMemo(() => {
        return modules?.find(mod => mod.code === location?.state?.moduleCode);
    }, [modules, location]);

    const [{loading: loadingFeedbacks}, loadBaselineFeedbacks] = usePromise(Api.getFeedbacks);
    const initializeFeedbackData = useCallback(async () => {
        try {
            const feedbackResponse = await loadBaselineFeedbacks({
                survey_result__module: activeModule?.id,
                survey_result__survey: +surveyId,
                is_baseline: true,
            });
            if(feedbackResponse?.count > 0) {
                dispatch(setAdvancedFeedbacks(feedbackResponse.results.map(fdback => ({
                    surveyResult: fdback.surveyResult,
                    actualScore: fdback.actualScore,
                    expectedScore: fdback.expectedScore,
                    comment: fdback.comment,
                }))));
            }
        } catch(err) {
            console.log(err);
        }
    }, [loadBaselineFeedbacks, dispatch, activeModule, surveyId]);

    useEffect(() => {
        if(isBaselineFeedback && activeModule && surveyId && advancedFeedbacks?.length === 0) {
            initializeFeedbackData();
        }
    }, [initializeFeedbackData, activeModule, surveyId, isBaselineFeedback, advancedFeedbacks]);

    const handleSubmit = useCallback(async () => {
        if(advancedFeedbacks.some(fdback => !fdback.expectedScore)) {
            return Toast.show(_('Feedback with comments only are not valid. Please make sure that all changed rows have expected value filled!'), Toast.DANGER);
        }
        if(shouldUpdateSurveyResults) {
            return handleShowOverwriteModal();
        }
        try {
            if(isBaselineFeedback) {
                await submitBaselineFeedbacks(advancedFeedbacks);
            } else {
                await submitFeedbacks(advancedFeedbacks);
            }
            Toast.show(_('Your feedback has been successfully submitted'), Toast.SUCCESS);
            dispatch(setAdvancedFeedbacks([]));
            navigate('..');
        } catch(error) {
            Toast.show(getErrorMessage(error) ?? _('An error occurred while submitting your feedbacks!'), Toast.DANGER);
        }
    }, [
        submitFeedbacks, 
        advancedFeedbacks, 
        dispatch, 
        isBaselineFeedback, 
        submitBaselineFeedbacks, 
        shouldUpdateSurveyResults, 
        handleShowOverwriteModal, 
        navigate
    ]);

    const handleUpdateResults = useCallback(async () => {
        try {
            const updatedSurveyResults = (advancedFeedbacks || []).map(feedback => {
                const feedbackResult = activeSurvey?.results?.find(result => result.id === feedback.surveyResult);
                return {
                    score: feedback.expectedScore,
                    statement: feedbackResult.statement,
                    module: feedbackResult.module
                };
            });
            await submitFeedbacks(advancedFeedbacks);
            await addSurveyResults(activeSurvey?.id, updatedSurveyResults);
            Toast.show(_('Your feedback has been successfully submitted'), Toast.SUCCESS);
            handleHideOverwriteModal();
            dispatch(setAdvancedFeedbacks([]));
            navigate('..');
        } catch(error) {
            Toast.show(getErrorMessage(error) ?? _('An error occurred while submitting your feedbacks!'), Toast.DANGER);
        }
    }, [advancedFeedbacks, submitFeedbacks, dispatch, navigate, activeSurvey, addSurveyResults, handleHideOverwriteModal]);

    const renderTopicItem = useCallback(listProps => (
        <TopicItem {...listProps} activeModule={activeModule} isBaselineFeedback={isBaselineFeedback} />
    ), [activeModule, isBaselineFeedback]);

    const hasSurveyWritePermission = useMemo(() => {
        if(!isAuthenticated) {
            return false;
        }
        if(!user) {
            return false;
        }
        return (
            activeSurvey?.createdBy === user.username
            || activeProject?.isAdminOrOwner
            || ['owner', 'write'].includes(activeProject?.accessLevel)
        );
    }, [isAuthenticated, user, activeProject, activeSurvey]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <div className={styles.backLink} onClick={handleGoBack}>
                        <BiChevronLeft
                            size={22}
                            className={styles.backIcon}
                        />
                    </div>
                    <h1 className={styles.title}>
                        {isBaselineFeedback ? (
                            <Localize>Baseline Feedbacks</Localize>
                        ) : (
                            <Localize>Advanced feedbacks</Localize>
                        )}
                    </h1>
                    <InfoTooltip
                        icon={BsQuestionCircle}
                        iconClassName={styles.helpIcon}
                        message={isBaselineFeedback
                            ? _('Baseline feedbacks are provided by environmental experts and are used to improve the NEAT+ weightage system. The expected scores entered here are used as baseline scores that the expert believes the NEAT+ system should produce given the survey answers. These values are used to generate insights in the weightage administration. The score of the statements ranges from 0 to 1 with 0 as the lowest impact and 1 as the highest impact.')
                            : _('Advanced feedbacks are supposed to be provided by environmental experts and helps on improving the NEAT+ weightage system. The score of the statements ranges from 0 to 1 with 0 as the lowest impact and 1 as the highest impact. Current values are scores generated by the system and expected values are scores the user expected to see.')}
                    />
                </div>
                <div className={styles.controls}>
                    {!isBaselineFeedback && hasSurveyWritePermission && (
                        <div className={styles.updateResultsToggle}>
                            <CheckboxInput 
                                id="shouldUpdateCheckbox" 
                                checkboxClassName={cs(styles.checkbox, {
                                    [styles.checkboxChecked]: shouldUpdateSurveyResults
                                })} 
                                onChange={handleChangeShouldUpdateResults} 
                            />
                            <label htmlFor="shouldUpdateCheckbox" className={styles.checkboxLabel}>
                                <Localize>Update survey results?</Localize>
                            </label>
                            <InfoTooltip
                                icon={BsQuestionCircle}
                                iconClassName={styles.updateTooltip}
                                iconSize={16}
                                tooltipClassName={styles.updateTooltipContent}
                                message={_('If you choose to update survey results, the survey result scores will be updated based on your feedback, and the survey report will change accordingly.')}
                            />
                        </div>
                    )}
                    <Button
                        onClick={handleSubmit}
                        loading={loading || baselineLoading}
                        disabled={advancedFeedbacks?.length===0}
                    >
                        <Localize>Submit</Localize>
                    </Button>
                </div>
            </div>
            <List
                loading={loadingFeedbacks}
                keyExtractor={keyExtractor}
                data={topics}
                renderItem={renderTopicItem}
            />
            {isOverwriteModalVisible && (
                <ConfirmationModal 
                    imageSrc={updateConfirmImg}
                    titleText={_('Overwrite survey results?')}
                    DescriptionComponent={<Localize>Your feedback submission will overwrite existing survey results. Do you want to proceed?</Localize>}
                    confirmButtonText={_('Overwrite')}
                    confirmButtonProps={{loading: updatingResults || loading || baselineLoading}}
                    onClose={handleHideOverwriteModal}
                    onConfirm={handleUpdateResults}
                />
            )}
        </div>
    );
};

export default SurveyFeedback;

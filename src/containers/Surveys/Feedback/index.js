import {useCallback, useMemo, useEffect} from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';
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
import {setAdvancedFeedbacks} from 'store/actions/survey';

import Api from 'services/api';
import usePromise from '@ra/hooks/usePromise';
import Toast from 'services/toast';
import {getErrorMessage} from '@ra/utils/error';
import {_} from 'services/i18n';

import FeedbackTopicTable from './FeedbackTable';
import styles from './styles.scss';

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
                />
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

const SurveyFeedback = props => {
    useInitActiveProject();
    useInitActiveSurvey();

    const dispatch = useDispatch();
    const {projectId, surveyId} = useParams();

    const {topics} = useSelector(state => state.statement);
    const {modules} = useSelector(state => state.context);
    const {advancedFeedbacks} = useSelector(state => state.survey);

    const history = useHistory();
    const location = useLocation();

    const [{loading}, submitFeedbacks] = usePromise(Api.postFeedback);
    const [{loading: baselineLoading}, submitBaselineFeedbacks] = usePromise(Api.addBaselineFeedback);

    useEffect(() => {
        if(!location?.state?.moduleCode) {
            if(projectId && surveyId) {
                return history.push(`/projects/${projectId}/surveys/${surveyId}/`);
            }
            return history.push('/projects/');
        }
        return () => dispatch(setAdvancedFeedbacks([]));
    }, [location, history, dispatch, projectId, surveyId]);

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
        try {
            if(advancedFeedbacks.some(fdback => !fdback.expectedScore)) {
                return Toast.show(_('Feedback with comments only are not valid. Please make sure that all changed rows have expected value filled!'), Toast.DANGER);
            }
            if(isBaselineFeedback) {
                await submitBaselineFeedbacks(advancedFeedbacks);
            } else {
                await submitFeedbacks(advancedFeedbacks);
            }
            Toast.show(_('Your feedback has been successfully submitted'), Toast.SUCCESS);
            dispatch(setAdvancedFeedbacks([]));
        } catch(error) {
            Toast.show(getErrorMessage(error) ?? _('An error occurred while submitting your feedbacks!'), Toast.DANGER);
        }
    }, [submitFeedbacks, advancedFeedbacks, dispatch, isBaselineFeedback, submitBaselineFeedbacks]);

    const renderTopicItem = useCallback(listProps => (
        <TopicItem {...listProps} activeModule={activeModule} isBaselineFeedback={isBaselineFeedback} />
    ), [activeModule, isBaselineFeedback]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <div className={styles.backLink} onClick={history.goBack}>
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
                        message={_('Advanced feedbacks are supposed to be provided by environmental experts and helps on improving the NEAT+ weightage system. The score of the statements ranges from 0 to 1 with 0 as the lowest impact and 1 as the highest impact. Current values are scores generated by the system and expected values are scores the user expected to see.')}
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    loading={loading || baselineLoading}
                    disabled={advancedFeedbacks?.length===0}
                >
                    <Localize>Submit</Localize>
                </Button>
            </div>
            <List
                loading={loadingFeedbacks}
                keyExtractor={keyExtractor}
                data={topics}
                renderItem={renderTopicItem}
            />
        </div>
    );
};

export default SurveyFeedback;

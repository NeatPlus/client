import {useEffect, useMemo} from 'react';

import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import Api from 'services/api';
import usePromise from '@ra/hooks/usePromise';
import {getSeverityFromScore} from 'utils/severity';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const FeedbackItem = ({item}) => {
    const expectedScore = useMemo(() => item.expectedScore?.toFixed(2), [item]);
    const actualScore = useMemo(() => item.actualScore?.toFixed(2), [item]);

    const createdDate = useMemo(() => {
        const date = new Date(item.createdAt);
        return date?.toDateString()?.substring(4) || '';
    }, [item]);

    return (
        <div className={styles.feedbackItem}>
            <div className={styles.feedbackItemHeader}>
                <p className={styles.feedbackUsername}>{item.createdBy}</p>
                <p className={styles.feedbackDate}>{createdDate}</p>
                <div className={styles.feedbackStatus}>
                    {item.status}
                </div>
            </div>
            <p className={styles.comment}>
                {item.comment}
            </p>
            <div className={styles.feedbackItemFooter}>
                <p className={styles.surveyName}>
                    {item.surveyTitle}
                </p>
                <div className={styles.scoreSection}>
                    <div className={styles.scoreItem}>
                        <Localize>Expected score</Localize>
                        <div className={cs(styles.scoreValue, {
                            [styles.scoreValueHigh]: getSeverityFromScore(expectedScore) === 'High',
                            [styles.scoreValueMedium]: getSeverityFromScore(expectedScore) === 'Medium',
                            [styles.scoreValueLow]: getSeverityFromScore(expectedScore) === 'Low',
                        })}>
                            {expectedScore}
                        </div>
                    </div>
                    <div className={styles.scoreItem}>
                        <Localize>Current score</Localize>
                        <div className={cs(styles.scoreValue, {
                            [styles.scoreValueHigh]: getSeverityFromScore(actualScore) === 'High',
                            [styles.scoreValueMedium]: getSeverityFromScore(actualScore) === 'Medium',
                            [styles.scoreValueLow]: getSeverityFromScore(actualScore) === 'Low',
                        })}>
                            {actualScore}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const FeedbackList = props => {
    const {statementId, moduleId, contextId} = props;

    const [{result, loading}, loadFeedbacks] = usePromise(Api.getFeedbacks); 

    useEffect(() => {
        if(statementId && moduleId && contextId) {
            loadFeedbacks({
                survey_result__statement: statementId,
                survey_result__module: moduleId,
                survey_result__module__context: contextId,
                is_baseline: false,
                ordering: '-created_at',
                status: 'pending',
            });
        }
    }, [statementId, moduleId, contextId, loadFeedbacks]);

    return (
        <List 
            loading={loading}
            className={styles.feedbackList}
            data={result?.results ?? []}
            keyExtractor={keyExtractor}
            renderItem={FeedbackItem}
            LoadingComponent={<p className={styles.infoMessage}>
                <Localize>Loading feedbacks...</Localize>
            </p>}
            EmptyComponent={<p className={styles.infoMessage}>
                <Localize>No feedbacks have been received.</Localize>
            </p>}
        />
    );
};

export default FeedbackList;

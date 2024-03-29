import {useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Table from '@ra/components/Table';

import cs from '@ra/cs';
import {_} from 'services/i18n';
import {setAdvancedFeedbacks} from 'store/actions/survey';

import styles from './styles.scss';

const FeedbackInput = props => {
    const {name: inputName, item, isBaselineFeedback} = props;

    const dispatch = useDispatch();

    const {advancedFeedbacks} = useSelector(state => state.survey);

    const [initialScore, initialComment] = useMemo(() => {
        const activeSurveyFeedback = advancedFeedbacks?.find(fdbck => fdbck.surveyResult === item.result?.id);
        return [activeSurveyFeedback?.expectedScore, activeSurveyFeedback?.comment];
    }, [advancedFeedbacks, item]);

    const isInvalid = useMemo(() => {
        return advancedFeedbacks.some(fdback => fdback.surveyResult === item.result.id && !fdback.expectedScore);
    }, [advancedFeedbacks, item]);

    const handleChangeFeedback = useCallback(({target}) => {
        const newFeedbacks = [...advancedFeedbacks];
        const feedbackItem = advancedFeedbacks.find(feedback => feedback.surveyResult === item.result.id);
        const feedbackIdx = advancedFeedbacks.findIndex(feedback => feedback.surveyResult === item.result.id);
        if(feedbackIdx > -1) {
            if(target.name==='comment') {
                if(!feedbackItem.expectedScore && !target.value) {
                    newFeedbacks.splice(feedbackIdx, 1);
                } else {
                    newFeedbacks.splice(feedbackIdx, 1, {...feedbackItem, comment: target.value});
                }
                return dispatch(setAdvancedFeedbacks(newFeedbacks));
            }
            if(!feedbackItem.comment && !target.value) {
                newFeedbacks.splice(feedbackIdx, 1);
            } else {
                newFeedbacks.splice(feedbackIdx, 1, {...feedbackItem, expectedScore: target.value});
            }
            return dispatch(setAdvancedFeedbacks(newFeedbacks));
        }
        if(target.name==='comment') {
            const newFeedbackObject = {
                surveyResult: item.result.id,
                comment: target.value,
            };
            if(isBaselineFeedback) {
                newFeedbackObject.actualScore = item.result.score;
            }
            return dispatch(setAdvancedFeedbacks([...newFeedbacks, newFeedbackObject]));
        }
        const newFeedbackObject = {
            surveyResult: item.result.id,
            expectedScore: target.value,
        };
        if(isBaselineFeedback) {
            newFeedbackObject.actualScore = item.result.score;
        }
        dispatch(setAdvancedFeedbacks([...newFeedbacks, newFeedbackObject]));
    }, [advancedFeedbacks, item, dispatch, isBaselineFeedback]);

    if(inputName==='comment') {
        return (
            <textarea
                name={inputName}
                rows="4"
                onChange={handleChangeFeedback}
                className={styles.commentInput}
                placeholder={_('Write a comment')}
                defaultValue={initialComment}
            />
        );
    }
    return (
        <input
            name={inputName}
            type="number"
            step="0.01"
            className={cs(styles.scoreInput, {[styles.scoreInputInvalid]: isInvalid})}
            onChange={handleChangeFeedback}
            defaultValue={initialScore}
        />
    );
};

const HeaderItem = ({column}) => {
    if(column.Header === _('Current Value') || column.Header === _('Expected Value')) {
        return (
            <div className={styles.scoreItem}>
                {column.Header}
            </div>
        );
    }
    return column.Header;
};

const DataItem = props => {
    const {item, column} = props;

    if(column.Header === _('Statements')) {
        return (
            <div className={styles.nameItem}>
                {item?.[column.accessor]}
            </div>
        );
    }
    if(column.Header === _('Current value')) {
        return (
            <div className={styles.scoreItem}>
                {item?.result?.score?.toFixed(2) ?? '-'}
            </div>
        );
    }
    if(column.Header === _('Expected value')) {
        return (
            <div className={styles.scoreInputContainer}>
                <FeedbackInput name="expectedValue" {...props} />
            </div>
        );
    }
    if(column.Header === _('Comments')) {
        return (
            <div className={styles.commentItem}>
                <FeedbackInput name="comment" {...props} />
            </div>
        );
    }
    return item?.[column.accessor] ?? '-';
};


const FeedbackTopicTable = props => {
    const {topicStatementResults, activeModule, isBaselineFeedback} = props;

    const columns = useMemo(() => ([
        {
            Header: _('Statements'),
            accessor: 'title',
        },
        {
            Header: _('Current value'),
            accessor: '',
        },
        {
            Header: _('Expected value'),
            accessor: '',
        },
        {
            Header: _('Comments'),
            accessor: '',
        },
    ]), []);

    const renderDataItem = useCallback(tableProps => (
        <DataItem {...tableProps} activeModule={activeModule} isBaselineFeedback={isBaselineFeedback} />
    ), [activeModule, isBaselineFeedback]);

    return (
        <div className={styles.feedbackTableContainer}>
            <Table 
                className={styles.table} 
                data={topicStatementResults} 
                columns={columns} 
                maxRows={topicStatementResults?.length}
                renderDataItem={renderDataItem}
                renderHeaderItem={HeaderItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                bodyRowClassName={styles.bodyRow}
            />
        </div> 
    );

};

export default FeedbackTopicTable;

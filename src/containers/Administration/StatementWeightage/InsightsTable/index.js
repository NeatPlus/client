import {useMemo, useEffect, useRef} from 'react';

import Table from '@ra/components/Table';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import {_} from 'services/i18n';
import {getSeverityFromScore} from 'utils/severity';
import useLoadBaselineSurveyAnswers from 'hooks/useLoadBaselineSurveyAnswers';

import styles from './styles.scss';

const DataItem = props => {
    const {item, column, isActive} = props;

    const inputRef = useRef();

    useEffect(() => {
        if(isActive) {
            inputRef.current?.focus();
        }
    }, [isActive]);

    if(column.Header === _('Surveys')) {
        return (
            <span className={styles.nameItem}>
                {item?.[column.accessor] ?? '-'}
            </span>
        );
    }

    return (
        <span className={cs(styles.scoreItem, {
            [styles.scoreItemHigh]: getSeverityFromScore(item?.[column.accessor]) === 'High',
            [styles.scoreItemMedium]: getSeverityFromScore(item?.[column.accessor]) === 'Medium',
            [styles.scoreItemLow]: getSeverityFromScore(item?.[column.accessor]) === 'Low',
        })}>
            {item?.[column.accessor] ?? '-'}
        </span>
    );
};

const InsightRow = (props) => {
    const {columns, ...otherProps} = props;

    useLoadBaselineSurveyAnswers(props.item.surveyId);

    return (
        <tr className={styles.bodyRow}>
            {columns.map(col => {
                return (
                    <td key={col.accessor}>
                        <DataItem column={col} {...otherProps} />
                    </td>
                );
            })}
        </tr>
    );
};


const OptionsTable = props => {
    const {feedbackData, loading, sumOfSquare, standardDeviation} = props;

    const columns = useMemo(() => ([
        {
            Header: _('Surveys'),
            accessor: 'surveyTitle',
        }, {
            Header: _('Expected'),
            accessor: 'expectedScore',
        }, {
            Header: _('Current'),
            accessor: 'actualScore',
        },
    ]), []);

    
    return (
        <div className={styles.insightsTableContainer}>
            <Table 
                loading={loading}
                LoadingComponent={<p className={styles.statusInfo}>
                    <Localize>Loading baseline surveys...</Localize>
                </p>}
                EmptyComponent={<p className={styles.statusInfo}>
                    <Localize>No baseline surveys found for the selected module!</Localize>
                </p>}
                className={styles.table}
                data={feedbackData}
                columns={columns}
                rowRenderer={InsightRow}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                bodyRowClassName={styles.bodyRow}
            />
            <div className={styles.insightsSummary}>
                <div className={styles.summaryItem}>
                    <Localize>Standard deviation:</Localize> <span className={styles.summaryValue}>{standardDeviation}</span>
                </div>
                <div className={styles.summaryItem}>
                    <Localize>Sum of squares:</Localize> <span className={styles.summaryValue}>{sumOfSquare}</span>
                </div>
            </div>
        </div> 
    );
};

export default OptionsTable;

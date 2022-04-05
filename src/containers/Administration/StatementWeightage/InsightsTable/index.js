import {useMemo, useEffect, useRef} from 'react';

import Table from '@ra/components/Table';

import cs from '@ra/cs';
import {_} from 'services/i18n';
import {Localize} from '@ra/components/I18n';
import {getSeverityFromScore} from 'utils/severity';

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

const OptionsTable = props => {
    const columns = useMemo(() => ([
        {
            Header: _('Surveys'),
            accessor: 'surveyTitle',
        }, {
            Header: _('Expected'),
            accessor: 'expectedScore',
        }, {
            Header: _('Current'),
            accessor: 'currentScore',
        },
    ]), []);

    const data = useMemo(() => ([
        {
            id: 1,
            surveyTitle: 'Test Survey 1',
            expectedScore: 0.85,
            currentScore: 0.7,
        },
        {
            id: 2,
            surveyTitle: 'Test Survey 2',
            expectedScore: 0.55,
            currentScore: 0.4,
        },
        {
            id: 3,
            surveyTitle: 'Test Survey 3',
            expectedScore: 0.95,
            currentScore: 0.6,
        },
    ]), []);

    return (
        <div className={styles.insightsTableContainer}>
            <Table 
                className={styles.table} 
                data={data} 
                columns={columns} 
                maxRows={data?.length}
                renderDataItem={DataItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                bodyRowClassName={styles.bodyRow}
            />
            <div className={styles.insightsSummary}>
                <div className={styles.summaryItem}>
                    <Localize>Variance:</Localize> <span className={styles.summaryValue}>0.3</span>
                </div>
                <div className={styles.summaryItem}>
                    <Localize>Sum of squares:</Localize> <span className={styles.summaryValue}>0.5</span>
                </div>
            </div>
        </div> 
    );
};

export default OptionsTable;

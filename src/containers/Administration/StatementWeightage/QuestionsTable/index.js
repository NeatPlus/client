import {useMemo, useCallback, useEffect, useRef} from 'react';

import WeightageInput from 'components/WeightageInput';
import Table from '@ra/components/Table';

import {_} from 'services/i18n';
import cs from '@ra/cs';

import styles from './styles.scss';

const HeaderItem = ({column}) => {
    if(column.Header === _('Weightage')) {
        return (
            <div className={styles.weightageItem}>
                {column.Header}
            </div>
        );
    }
    return column.Header;
};

const DataItem = props => {
    const {item, index, column, isActive} = props;

    const inputRef = useRef();

    useEffect(() => {
        if(isActive) {
            inputRef.current?.focus();
        }
    }, [isActive]);

    if(column.Header === _('Questions')) {
        return (
            <div className={cs(styles.nameItem, {[styles.nameItemActive]: isActive})}>
                {item?.[column.accessor]}
            </div>
        );
    }
    if(column.Header === _('S.N.')) {
        return `${index+1}.`;
    }
    if(column.Header === _('Weightage')) {
        return (
            <WeightageInput ref={inputRef} {...props} />
        );
    }
    return item?.[column.accessor] ?? '-';
};


const QuestionRow = (props) => {
    const {columns, activeQuestion, setActiveQuestion, ...otherProps} = props;
    const {item} = props;

    const isActive = useMemo(() => {
        return activeQuestion?.id === item.id;
    }, [activeQuestion, item]);

    const handleQuestionClick = useCallback(() => {
        setActiveQuestion(item);
    }, [setActiveQuestion, item]);

    return (
        <tr 
            className={cs(styles.row, {[styles.rowActive]: isActive})}
            onClick={handleQuestionClick}
        >
            {columns.map(col => {
                return (
                    <td key={col.accessor}>
                        <DataItem column={col} isActive={isActive} {...otherProps} />
                    </td>
                );
            })}
        </tr>
    );
};


const QuestionsTable = props => {
    const {
        selectedQuestions,
        activeQuestion,
        setActiveQuestion,
    } = props;

    const columns = useMemo(() => ([
        {
            Header: _('S.N.'),
            accessor: '',
        }, {
            Header: _('Questions'),
            accessor: 'title',
        }, {
            Header: _('Weightage'),
            accessor: 'weightage',
        },
    ]), []);

    const renderQuestionRow = useCallback(tableProps => {
        return (
            <QuestionRow
                {...tableProps}
                activeQuestion={activeQuestion}
                setActiveQuestion={setActiveQuestion}
            />
        );
    }, [activeQuestion, setActiveQuestion]);

    const renderQuestionDataItem = useCallback(tableProps => {
        return (
            <DataItem {...tableProps} activeQuestion={activeQuestion} />
        );
    }, [activeQuestion]);

    return (
        <div className={styles.questionsTableContainer}>
            <Table 
                className={styles.table} 
                data={selectedQuestions} 
                columns={columns} 
                maxRows={selectedQuestions?.length}
                renderDataItem={renderQuestionDataItem}
                renderHeaderItem={HeaderItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                rowRenderer={renderQuestionRow}
            />
        </div> 
    );
};

export default QuestionsTable;

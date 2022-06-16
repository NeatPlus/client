import {useMemo, useCallback, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {MdRefresh} from 'react-icons/md';

import WeightageInput from 'components/WeightageInput';
import Table from '@ra/components/Table';
import {Localize} from '@ra/components/I18n';

import {setChangedQuestions} from 'store/actions/admin';

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
    if(column.Header === 'Undo') {
        return null;
    }
    return column.Header;
};

const DataItem = props => {
    const {item, index, column, isActive} = props;

    const dispatch = useDispatch();
    const {changedQuestions} = useSelector(state => state.admin);

    const isWeightageChanged = useMemo(() => {
        return changedQuestions.some(ques => ques.question === item.id);
    }, [changedQuestions, item]);

    const handleUndoClick = useCallback(e => {
        const newChangedQuestions = changedQuestions.filter(ques => ques.question !== item.id);
        dispatch(setChangedQuestions(newChangedQuestions));
    }, [dispatch, changedQuestions, item]);

    const inputRef = useRef();

    useEffect(() => {
        if(isActive) {
            inputRef.current?.focus();
        }
    }, [isActive]);

    if(column.Header === _('Questions')) {
        return (
            <div className={cs(styles.nameItem, {
                [styles.nameItemActive]: isActive,
                [styles.nameItemEmpty]: !item.weightage,
            })}>
                {item?.[column.accessor]}
            </div>
        );
    }
    if(column.Header === _('S.N.')) {
        return <span className={cs({[styles.numberEmpty]: !item.weightage})}>{index + 1}.</span>;
    }
    if(column.Header === _('Weightage')) {
        return (
            <WeightageInput ref={inputRef} {...props} />
        );
    }
    if(column.Header === 'Undo' && isWeightageChanged) {
        return (
            <MdRefresh className={styles.undoIcon} size={18} onClick={handleUndoClick} />
        );
    }
    return item?.[column.accessor] ?? ' ';
};


const QuestionRow = (props) => {
    const {columns, activeQuestion, onQuestionClick, ...otherProps} = props;
    const {item} = props;

    const isActive = useMemo(() => {
        return activeQuestion?.id === item.id;
    }, [activeQuestion, item]);

    const handleQuestionClick = useCallback(() => {
        onQuestionClick?.(item);
    }, [onQuestionClick, item]);

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
        onQuestionClick,
        ...tableProps
    } = props;

    const {changedQuestions} = useSelector(state => state.admin);

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
        }, {
            Header: 'Undo',
            accessor: '',
        },
    ]), []);

    const editedSelectedQuestions = useMemo(() => {
        return selectedQuestions?.map(ques => {
            const changedWeightageQuestion = changedQuestions.find(chQues => chQues.question === ques.id);
            if(changedWeightageQuestion) {
                return {
                    ...ques,
                    weightage: changedWeightageQuestion.weightage,
                };
            }
            return ques;
        }) || [];
    }, [changedQuestions, selectedQuestions]);

    const renderQuestionRow = useCallback(tableProps => {
        return (
            <QuestionRow
                {...tableProps}
                activeQuestion={activeQuestion}
                onQuestionClick={onQuestionClick}
            />
        );
    }, [activeQuestion, onQuestionClick]);

    const renderQuestionDataItem = useCallback(tableProps => {
        return (
            <DataItem {...tableProps} activeQuestion={activeQuestion} />
        );
    }, [activeQuestion]);

    return (
        <div className={styles.questionsTableContainer}>
            <Table 
                className={styles.table} 
                data={editedSelectedQuestions} 
                columns={columns} 
                maxRows={selectedQuestions?.length}
                renderDataItem={renderQuestionDataItem}
                renderHeaderItem={HeaderItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                rowRenderer={renderQuestionRow}
                LoadingComponent={<p className={styles.statusMessage}>
                    <Localize>Loading...</Localize>
                </p>}
                EmptyComponent={<p className={styles.statusMessage}>
                    <Localize>No questions selected.</Localize>
                </p>}
                {...tableProps}
            />
        </div> 
    );
};

export default QuestionsTable;

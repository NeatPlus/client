import {forwardRef, useMemo, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {MdOutlineErrorOutline} from 'react-icons/md';

import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';

import {setChangedOptions, setChangedQuestions} from 'store/actions/admin';

import styles from './styles.scss';

const WeightageInput = forwardRef((props, ref) => {
    const {item, column, isActive} = props;

    const isOption = useMemo(() => {
        if(item) {
            return Object.prototype.hasOwnProperty.call(item, 'question');
        }
    }, [item]);

    const dispatch = useDispatch();
    const {changedQuestions, changedOptions} = useSelector(state => state.admin);

    const handleChangeWeightage = useCallback(e => {
        const {value} = e.target;
        if (isOption) {
            const updatedOption = {option: item.id, weightage: value ? Number(value) : null};
            const newChangedOptions = [...changedOptions];
            const optIdx = newChangedOptions.findIndex(opt => opt.option === item.id);
            if (optIdx > -1) {
                newChangedOptions.splice(optIdx, 1, updatedOption);
                return dispatch(setChangedOptions(newChangedOptions));
            }
            return dispatch(setChangedOptions([...newChangedOptions, updatedOption]));
        }
        const updatedQuestion = {question: item.id, weightage: value ? Number(value) : null};
        const newChangedQuestions = [...changedQuestions];
        const quesIdx = newChangedQuestions.findIndex(ques => ques.question === item.id);
        if (quesIdx > -1) {
            newChangedQuestions.splice(quesIdx, 1, updatedQuestion);
            return dispatch(setChangedQuestions(newChangedQuestions));
        }
        return dispatch(setChangedQuestions([...newChangedQuestions, updatedQuestion]));
    }, [changedOptions, changedQuestions, dispatch, isOption, item.id]);

    useEffect(() => {
        if(ref?.current) {
            ref.current.value = item[column.accessor] ?? '';
        }
    }, [ref, item, column]);

    const handleFocus = useCallback(() => {
        if(isOption) {
            ref.current.select();
        }
    }, [ref, isOption]);

    const handleWheel = useCallback(e => {
        e.target.blur();
    }, []);

    return (
        <div className={styles.weightageItem}>
            {!item[column.accessor] && (
                <div className={styles.emptyMessage}>
                    <MdOutlineErrorOutline className={styles.emptyIcon} />
                    <small className={styles.emptyText}>
                        <Localize>Field empty</Localize>
                    </small>
                </div>
            )}
            <input
                type="number"
                ref={ref}
                key={isOption ? `optionWght-${item.id}` : `questionWght-${item.id}`}
                className={cs(styles.weightageInput, {
                    [styles.weightageInputActive]: isActive,
                    [styles.weightageInputEmpty]: item[column.accessor] === null,
                })}
                defaultValue={item[column.accessor] ?? ''}
                onChange={handleChangeWeightage}
                onFocus={handleFocus}
                onWheel={handleWheel}
            />
        </div>
    );
});

export default WeightageInput;


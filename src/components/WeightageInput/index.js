import {forwardRef, useMemo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

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
            const updatedOption = {option: item.id, weightage: value};

            const newChangedOptions = [...changedOptions];
            const optIdx = newChangedOptions.findIndex(opt => opt.option === item.id);
            if (optIdx > -1) {
                value==='' 
                    ? newChangedOptions.splice(optIdx, 1) 
                    : newChangedOptions.splice(optIdx, 1, updatedOption);
                return dispatch(setChangedOptions(newChangedOptions));
            }
            return dispatch(setChangedOptions([...newChangedOptions, updatedOption]));
        }
        const updatedQuestion = {question: item.id, weightage: value};

        const newChangedQuestions = [...changedQuestions];
        const quesIdx = newChangedQuestions.findIndex(ques => ques.question === item.id);
        if (quesIdx > -1) {
            value==='' 
                ? newChangedQuestions.splice(quesIdx, 1) 
                : newChangedQuestions.splice(quesIdx, 1, updatedQuestion);
            return dispatch(setChangedQuestions(newChangedQuestions));
        }
        return dispatch(setChangedQuestions([...newChangedQuestions, updatedQuestion]));
    }, [changedOptions, changedQuestions, dispatch, isOption, item]); 

    return (
        <div className={styles.weightageItem}>
            <input
                type="number"
                ref={ref}
                className={cs(styles.weightageInput, {[styles.weightageInputActive]: isActive})}
                defaultValue={item[column.accessor]}
                onChange={handleChangeWeightage}
            />
        </div>
    );
});

export default WeightageInput;


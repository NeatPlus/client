import {useMemo, useCallback, forwardRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import parse from 'html-react-parser'; 

import LocationInput from 'components/Inputs/LocationInput';
import SingleOptionInput from 'components/Inputs/SingleOptionInput';
import MultiOptionInput from 'components/Inputs/MultiOptionInput';
import BooleanInput from 'components/Inputs/BooleanInput';
import ImageInput from 'components/Inputs/ImageInput';
import TextAreaInput from 'components/Inputs/TextAreaInput';

import Input from '@ra/components/Form/Input';
import DateInput from '@ra/components/Form/DateInput';
import NumberInput from '@ra/components/Form/NumberInput';

import cs from '@ra/cs';
import * as questionActions from 'store/actions/question';

import styles from './styles.scss';

const getInputComponent = question => {
    switch(question.answerType) {
    case 'date':
        return DateInput;
    case 'boolean':
        return BooleanInput;        
    case 'location':
        return LocationInput;
    case 'single_option':
        return SingleOptionInput;
    case 'multiple_option':
        return MultiOptionInput;
    case 'number':
        return NumberInput;
    case 'single_image':
    case 'multiple_image':
        return ImageInput;
    default:
        if(question.code==='overview') {
            return TextAreaInput;
        }
        return Input;
    }
};

const Question = forwardRef((props, ref) => {
    const {item, showRequired, editable} = props;

    const dispatch = useDispatch();
    const {options, answers} = useSelector(state => state.question);

    const InputComponent = getInputComponent(item);

    const showRequiredMessage = useMemo(() => 
        item.isRequired && 
        showRequired && 
        answers && 
        !answers?.some(
            ans => ans.question === item.id
        ), 
    [item, showRequired, answers]
    );

    const handleChangeAnswer = useCallback(({value, formattedValue}) => {
        if(!editable) {
            return;
        }
        const answer = {
            answerType: item.answerType,
            question: item.id,
        };
        if(item.answerType === 'single_option' || 
            item.answerType === 'multiple_option') {
            answer.options = value;    
        } else {
            answer.answer = value;
        }
        if(formattedValue) {
            answer.formattedAnswer = formattedValue;
        }
        const answerIndex = answers.findIndex(ans => {
            const questionId = ans.question?.id || ans.question;
            return questionId === item.id;
        });
        if(answerIndex!==-1) {
            const newAnswers = answers;
            if(!value || (value && value?.length===0)) {
                newAnswers.splice(answerIndex, 1);   
            } else {
                newAnswers.splice(answerIndex, 1, answer);
            }
            return dispatch(questionActions.setAnswers([...newAnswers]));
        }
        dispatch(questionActions.setAnswers([...answers, answer]));
    }, [item, answers, dispatch, editable]);

    const answerItem = useMemo(() => {
        return answers.find(ans => {
            const questionId = ans.question?.id || ans.question;
            return questionId === item.id;
        });
    }, [answers, item]);

    return (
        <>
            <div ref={ref} className={cs(styles.contentBlock, {
                [styles.contentBlockRequired]: showRequiredMessage,
                [styles.contentBlockBoolean]: item.answerType==='boolean',
            })}>
                <p className={cs(styles.contentBlockTitle, {
                    [styles.descriptionTitle]: item.answerType==='description',
                    [styles.inputTitle]: item.answerType!=='description',
                })}>
                    {item.title}
                </p>
                {!!item.hints && (
                    <p className={styles.contentHint}>{item.hints}</p>
                )}
                {item.answerType!=='description' ? (
                    <InputComponent
                        disabled={!editable}
                        className={styles.input} 
                        placeholder="Add Answer..." 
                        onChange={handleChangeAnswer}
                        options={options?.filter(opt => opt.question === item.id)}
                        checkedOptions={answerItem?.options}
                        value={answerItem?.answer}
                        answer={answerItem?.answer}
                        formattedAnswer={answerItem?.formattedAnswer}
                        multiple={item.answerType==='multiple_image'}
                    />
                ) : (
                    <p className={styles.contentBlockText}>
                        {parse(item.description || '')} 
                    </p>
                )}
            </div>
            {showRequiredMessage && (
                <span className={styles.requiredText}>Required</span>
            )}
        </>
    );
});

export default Question;

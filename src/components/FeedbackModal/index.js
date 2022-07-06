import {useCallback, useState, useMemo} from 'react';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import Label from '@ra/components/Form/Label';
import {Localize} from '@ra/components/I18n';
import SliderInput from '@ra/components/Form/SliderInput';

import Api from 'services/api';
import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import {_} from 'services/i18n';
import Toast from 'services/toast';
import {getColorFromScore, getSeverityFromScore} from 'utils/severity';
import {getErrorMessage} from '@ra/utils/error';

import styles from './styles.scss';

const FeedbackModal = (props) => {
    const {isVisible, onClose, statementResult} = props;
    const [{loading}, submitFeedback] = usePromise(Api.postFeedback);

    const [score, setScore] = useState(statementResult.score);

    const [comment, setComment] = useState('');

    const handleScoreChange = useCallback(({value}) => {
        setScore(value);
    }, []);

    const handleClose = useCallback(() => {
        setScore(statementResult.score);
        onClose();
    }, [statementResult, onClose]);

    const handleSubmit = useCallback(async () => {
        try {
            await submitFeedback([{
                surveyResult: statementResult.id,
                comment,
                expectedScore: score,
            }]);
            Toast.show(_('Your feedback has been submitted!'), Toast.SUCCESS); 
            handleClose();
        } catch (error) {
            console.log(error);
            Toast.show(getErrorMessage(error) ?? _('Something went wrong!'), Toast.DANGER);
        }
    }, [statementResult, comment, submitFeedback, handleClose, score]);

    const currentSeverity = useMemo(() => {
        const severity =  getSeverityFromScore(statementResult.score);
        if(!severity) {
            return 'Low';
        }
        return severity;
    }, [statementResult]);

    const renderTrackLabel = useCallback(({item: label}) => {
        return (
            <div className={cs(styles.trackLabelItem, {
                [styles.trackLabelItemLow]: label===_('Low'),
                [styles.trackLabelItemMedium]: label===_('Medium'),
                [styles.trackLabelItemHigh]: label===_('High'),
            })}>
                {label}
            </div>
        );
    }, []);

    const thumbStyle = useMemo(() => {
        return {
            width: 15,
            height: 25,
            borderRadius: 6,
            backgroundColor: getColorFromScore(score),
        }; 
    }, [score]);

    const activeTrackColor = useMemo(() => getColorFromScore(score), [score]);

    const handleCommentChange = useCallback(({target}) => {
        setComment(target.value);
    }, []);

    return (
        <Modal className={styles.modal} isVisible={isVisible}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Suggest expected severity</Localize></h2>
                <div className={styles.closeContainer} onClick={handleClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <p className={styles.contentText}>
                    <Localize>Explain why you think this should have different severity score.</Localize>
                </p>
                <div className={styles.inputContainer}>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Current severity</Label>
                        <div className={styles.input}>
                            <div className={cs(styles.severityItem, {
                                [styles.severityItemHigh]: currentSeverity === _('High'),
                                [styles.severityItemMedium]: currentSeverity === _('Medium'),
                                [styles.severityItemLow]: currentSeverity === _('Low'),
                            })}>
                                {currentSeverity}
                            </div>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Your expected severity</Label>
                        <SliderInput 
                            containerClassName={styles.input}
                            onChange={handleScoreChange}
                            step={0.1}
                            inputRange={[0, 1]}
                            marks={[_('Low'), _('Medium'), _('High')]}
                            marksContainerClassName={styles.trackLabelsContainer}
                            renderMark={renderTrackLabel}
                            activeTrackColor={activeTrackColor}
                            thumbStyle={thumbStyle}
                            defaultValue={statementResult.score}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Label className={styles.inputLabel}>Comment</Label>
                        <textarea
                            onChange={handleCommentChange}
                            rows="5"
                            className={cs(styles.input, styles.textarea)}
                            placeholder={_('Write a comment')} 
                        />
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Button onClick={handleClose} type='button' secondary>
                        <Localize>Cancel</Localize>
                    </Button>
                    <Button loading={loading} onClick={handleSubmit}>
                        <Localize>Submit</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FeedbackModal;

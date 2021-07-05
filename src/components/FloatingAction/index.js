import {useCallback, useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux'; 

import Button from 'components/Button';
import DeleteDraftModal from 'components/DeleteDraftModal';
import TakeSurveyModal from 'components/TakeSurveyModal';

import cs from '@ra/cs';
import Toast from 'services/toast';
import {initDraftAnswers} from 'utils/dispatch';
import * as questionActions from 'store/actions/question';

import styles from './styles.scss';

const FloatingAction = ({icon: Icon, surveyTitle}) => {
    const actionRef = useRef();
    const dispatch = useDispatch();

    const {draftAnswers} = useSelector(state => state.draft);

    const [actionVisible, setActionVisible] = useState(false);
    const [surveyModalVisible, setSurveyModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const hideAction = useCallback((event) => {
        if(!event?.target || !actionRef.current.contains(event.target)) {
            setActionVisible(false);
            document.removeEventListener('click', hideAction);
        }
    }, []);

    const showAction = useCallback(() => {
        if(actionVisible) {
            return;
        }
        setActionVisible(true);
        setTimeout(() => {
            document.addEventListener('click', hideAction);
        }, 50);
    }, [hideAction, actionVisible]);

    const hideConfirmModal = useCallback(() => {
        setConfirmModalVisible(false);
    }, []);
    const showConfirmModal = useCallback(() => {
        setConfirmModalVisible(true);
    }, []);

    const showSurveyModal = useCallback(() => {
        hideAction();
        dispatch(questionActions.setAnswers(draftAnswers));
        setSurveyModalVisible(true);
    }, [hideAction, draftAnswers, dispatch]);

    const hideSurveyModal = useCallback(() => {
        setSurveyModalVisible(false);
    }, []);

    const handleDelete = useCallback(() => {
        initDraftAnswers();
        Toast.show(`${surveyTitle} has been deleted`, Toast.SUCCESS);
    }, [surveyTitle]);
    useEffect(() => () => hideAction(), [hideAction]);

    return (
        <>
            <div onClick={showAction} className={styles.actionButton}>
                {Icon && <Icon className={styles.icon} />}
            </div>
            <div ref={actionRef} className={cs(styles.draftAction, {
                [styles.draftActionVisible]: actionVisible,
            })}>
                <p className={styles.draftDesc}>
                    <span className={styles.surveyTitle}>
                        {surveyTitle}
                    </span> survey has been saved in draft
                </p>
                <div className={styles.buttons}>
                    <Button onClick={showSurveyModal} className={styles.button}>
                        Resume
                    </Button>
                    <Button
                        type='button'
                        secondary
                        className={styles.button}
                        onClick={showConfirmModal}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <TakeSurveyModal 
                isVisible={surveyModalVisible} 
                onClose={hideSurveyModal} 
            />
            <DeleteDraftModal
                isVisible={confirmModalVisible}
                onClose={hideConfirmModal}
                onDelete={handleDelete}
            />
        </>
    );
};

export default FloatingAction;

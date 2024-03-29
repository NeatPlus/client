import {useCallback, useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux'; 

import Button from 'components/Button';
import SurveyModals from 'components/SurveyModals';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import Toast from 'services/toast';
import useSurveyModals from 'hooks/useSurveyModals';
import {initDraftAnswers} from 'utils/dispatch';
import * as questionActions from 'store/actions/question';

import styles from './styles.scss';

const FloatingAction = ({icon: Icon, surveyTitle}) => {
    const actionRef = useRef();
    const dispatch = useDispatch();

    const {draftAnswers, moduleCode, surveyId} = useSelector(state => state.draft);

    const surveyModalsConfig = useSurveyModals(moduleCode, surveyId);

    const [expanded, setExpanded] = useState(true);
    const [actionVisible, setActionVisible] = useState(false);

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
        setExpanded(false);
        setTimeout(() => {
            document.addEventListener('click', hideAction);
        }, 50);
    }, [hideAction, actionVisible]);

    const showSurveyModal = useCallback(() => {
        hideAction();
        dispatch(questionActions.setAnswers(draftAnswers));
        surveyModalsConfig.handleShowTakeSurvey(false);
    }, [hideAction, draftAnswers, dispatch, surveyModalsConfig]);

    const handleDelete = useCallback(() => {
        initDraftAnswers();
        Toast.show(`${surveyTitle} ${_('draft has been deleted')}`, Toast.SUCCESS);
    }, [surveyTitle]);
    useEffect(() => () => hideAction(), [hideAction]);
    
    const collapseAction = useCallback(() => setExpanded(false), []);
    const expandAction = useCallback(() => {
        setExpanded(true);
        setTimeout(collapseAction, 6000);
    }, [collapseAction]);

    useEffect(() => {
        if(draftAnswers.length > 0) {
            expandAction();
            return () => {
                clearTimeout(collapseAction);
            };
        }
    }, [draftAnswers, expandAction, collapseAction]);

    useEffect(() => {
        setTimeout(collapseAction, 6000);
        return () => {
            clearTimeout(collapseAction);
        };
    }, [collapseAction]);

    return (
        <div className='no-print'>
            <div onClick={showAction} className={cs(styles.actionButton, {[styles.actionButtonExpanded]: expanded})}>
                {Icon && <Icon className={styles.icon} />}
            </div>
            {expanded && (
                <div className={styles.actionInfo}>
                    <Localize>You have got a draft survey.</Localize>
                </div>
            )}
            <div ref={actionRef} className={cs(styles.draftAction, {
                [styles.draftActionVisible]: actionVisible,
            })}>
                <p className={styles.draftDesc}>
                    <Localize
                        text="{{ surveyTitle; }} survey has been saved in draft."
                        surveyTitle={<span className={styles.surveyTitle}>{surveyTitle}</span>}
                    />
                </p>
                <div className={styles.buttons}>
                    <Button onClick={showSurveyModal} className={styles.button}>
                        <Localize>Resume</Localize>
                    </Button>
                    <Button
                        type='button'
                        secondary
                        className={styles.button}
                        onClick={surveyModalsConfig.handleShowDeleteDraft}
                    >
                        <Localize>Delete</Localize>
                    </Button>
                </div>
            </div>
            <SurveyModals {...surveyModalsConfig} onDelete={handleDelete} />
        </div>
    );
};

export default FloatingAction;

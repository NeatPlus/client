import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {setActiveSurvey} from 'store/actions/survey';
import {setRemovedItems} from 'store/actions/dashboard';

import {getFormattedSurveys} from 'store/selectors/survey';

const useInitActiveSurvey = (surveyId) => {
    const {surveyId: fallbackId} = useParams();

    const dispatch = useDispatch();

    const {status} = useSelector(state => state.survey);
    const surveys = useSelector(getFormattedSurveys);

    useEffect(() => {
        if(status === 'complete') {
            const activeSurvey = surveys?.find(sur => {
                if(surveyId) {
                    return sur.id === +surveyId;
                }
                return sur.id === +fallbackId;
            });
            dispatch(setActiveSurvey(activeSurvey));
            dispatch(setRemovedItems(activeSurvey?.config?.removedItems || []));
        }
        return () => {
            dispatch(setRemovedItems([]));
        };
    }, [surveyId, status, dispatch, surveys, fallbackId]);
};

export default useInitActiveSurvey;

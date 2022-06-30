import {useEffect, useMemo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Api from 'services/api';
import usePromise from '@ra/hooks/usePromise';

import {addBaselineSurveyAnswers} from 'store/actions/admin';

const useLoadBaselineSurveyAnswers = (surveyId) => {
    const dispatch = useDispatch();

    const {baselineSurveyAnswers} = useSelector(state => state.admin);

    const [, loadBaselineSurveyAnswers] = usePromise(Api.getSurveyAnswers);

    const doesAlreadyExist = useMemo(() => baselineSurveyAnswers?.some(baseline => baseline.survey === surveyId), [surveyId, baselineSurveyAnswers]);

    const handleLoadData = useCallback(async () => {
        try {
            const surveyAnswersResponse = await loadBaselineSurveyAnswers({survey: surveyId, limit: -1});
            if(surveyAnswersResponse?.results?.length > 0) {
                dispatch(addBaselineSurveyAnswers(surveyId, surveyAnswersResponse.results));
            }
        } catch(error) {
            console.log(error);
        }
    }, [surveyId, loadBaselineSurveyAnswers, dispatch]);

    useEffect(() => {
        if(surveyId && !doesAlreadyExist) {
            handleLoadData();
        }
    }, [surveyId, handleLoadData, doesAlreadyExist]);
};

export default useLoadBaselineSurveyAnswers;

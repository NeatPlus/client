import React, {useCallback, useEffect, useMemo} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import NavBar from 'components/NavBar';
import {NeatLoader} from 'components/Loader';
import SurveyTabs from 'containers/Surveys/Dashboard/SurveyTabs';

import usePromise from '@ra/hooks/usePromise';
import Api from 'services/api';
import {setActiveSurvey} from 'store/actions/survey';
import {setRemovedItems} from 'store/actions/dashboard';

import {getSeverityFromScore} from 'utils/severity';

import styles from './styles.scss';

const PublicSurvey = () => {
    const history = useHistory();
    const {identifier} = useParams();
    
    const dispatch = useDispatch();

    const [{loading}, getPublicSurvey] = usePromise(Api.getPublicSurvey);
    const {questions} = useSelector(state => state.question); 
    const {statements} = useSelector(state => state.statement);

    const isDataReady = useMemo(() => questions['sens'].length && statements.length, [questions, statements]);

    const getSurvey = useCallback(async () => {
        if(!isDataReady) {
            return;
        }
        try {
            const survey = await getPublicSurvey(identifier);
            const config = typeof survey.config === 'string' ? JSON.parse(survey.config) : survey.config;
            const answers = survey.answers.map(ans => {
                // FIXME: Add support for other modules
                const que = questions['sens'].find(q => q.id === ans.question);
                return {
                    ...ans,
                    question: {
                        id: que?.id,
                        code: que?.code,
                    },
                };
            });
            const results = survey.results.map(res => {
                const statement = statements.find(st => st?.id === res.statement);
                return {
                    ...res,
                    topic: statement?.topic,
                    severity: getSeverityFromScore(res.score)
                };
            });
            dispatch(setActiveSurvey({
                ...survey,
                answers,
                results,
                config,
            }));
            dispatch(setRemovedItems(config?.removedItems || []));
        } catch(error) {
            history.push('/404');
            console.log(error);
        }
    }, [
        identifier, 
        getPublicSurvey, 
        dispatch, 
        questions, 
        statements, 
        history, 
        isDataReady,
    ]); 

    useEffect(() => {
        getSurvey();
    }, [getSurvey]);

    return (
        <div className={styles.container}>
            <NavBar dark />
            {(loading || !isDataReady) ? (
                <NeatLoader containerClassName={styles.container} />
            ) : (
                <div className={styles.tabsContainer}>
                    <SurveyTabs publicMode />
                </div>
            )}
        </div>
    );
};

export default PublicSurvey;

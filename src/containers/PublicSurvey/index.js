import React, {useCallback, useEffect, useMemo} from 'react';
import {useParams, useNavigate, Link, useSearchParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import Button from 'components/Button';
import {NeatLoader} from 'components/Loader';
import SurveyTabs from 'containers/Surveys/Dashboard/SurveyTabs';
import {_} from 'services/i18n';

import usePromise from '@ra/hooks/usePromise';
import Api from 'services/api';
import {setActiveSurvey} from 'store/actions/survey';
import {setRemovedItems} from 'store/actions/dashboard';

import {getSeverityFromScore} from 'utils/severity';
import logo from 'assets/images/logo-dark.svg';

import styles from './styles.scss';

const PublicSurvey = () => {
    const navigate = useNavigate();
    const {identifier} = useParams();
    
    const dispatch = useDispatch();

    const [{loading}, getPublicSurvey] = usePromise(Api.getPublicSurvey);

    const {isAuthenticated} = useSelector(state => state.auth);
    const {questions, status: questionsStatus} = useSelector(state => state.question); 
    const {statements} = useSelector(state => state.statement);
    const {activeSurvey} = useSelector(state => state.survey);

    const isDataReady = useMemo(() => {
        return questionsStatus==='complete' && statements.length;
    }, [statements, questionsStatus]);

    const allQuestions = useMemo(() => {
        return Object.values(questions)?.flatMap(el => el) || [];
    }, [questions]);

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = useMemo(() => {
        const tabParam = searchParams.get('module');
        if(!tabParam) {
            return 'overview';
        }
        return tabParam;
    }, [searchParams]);

    const handleTabChange = useCallback(payload => {
        if(payload.activeTab === 'overview') {
            searchParams.delete('module');
        } else {
            searchParams.set('module', payload.activeTab);
        }
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    const getSurvey = useCallback(async () => {
        if(!isDataReady) {
            return;
        }
        try {
            const survey = await getPublicSurvey(identifier);
            const config = typeof survey.config === 'string' ? JSON.parse(survey.config) : survey.config;
            const answers = survey.answers.map(ans => {
                const que = allQuestions.find(q => q.id === ans.question);
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
            navigate('/404');
            console.log(error);
        }
    }, [
        identifier, 
        getPublicSurvey, 
        dispatch, 
        allQuestions, 
        statements, 
        navigate, 
        isDataReady,
    ]); 

    useEffect(() => {
        getSurvey();
    }, [getSurvey]);

    const handleNavButtonClick = useCallback(() => {
        navigate(isAuthenticated ? '/projects/' : '/login/');
    }, [navigate, isAuthenticated]);

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logoContainer}>
                    <Link to='/'>
                        <img className={styles.logo} src={logo} alt={_('Neat+ Logo')} />
                    </Link> 
                </div>
                <h1 className={styles.title}>{activeSurvey?.title}</h1>
                <div className={styles.buttonContainer}>
                    <Button outline className={styles.button} onClick={handleNavButtonClick}>
                        {isAuthenticated ? _('Go to Projects') : _('Login')} 
                    </Button>
                </div>
                <div className={styles.spacer} />
            </nav>
            {(loading || !isDataReady) ? (
                <NeatLoader containerClassName={styles.container} />
            ) : (
                <div className={styles.tabsContainer}>
                    <SurveyTabs
                        publicMode
                        activeTab={activeTab} 
                        onTabChange={handleTabChange}
                    />
                </div>
            )}
        </div>
    );
};

export default PublicSurvey;

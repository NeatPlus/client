import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {useLocation, useParams, useHistory, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {BiChevronLeft, BiPlusCircle} from 'react-icons/bi';
import {BsChevronRight} from 'react-icons/bs';

import Button from 'components/Button';
import Tabs, {Tab} from 'components/Tabs';
import ToggleSwitch from '@ra/components/Form/ToggleSwitch';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';

import Api from 'services/api';
import {_} from 'services/i18n';
import Toast from 'services/toast';
import {resetWeightages} from 'store/actions/admin';

import QuestionsTable from './QuestionsTable';
import OptionsTable from './OptionsTable';
import InsightsTable from './InsightsTable';
import FeedbackList from './FeedbackList';
import styles from './styles.scss';

const StatementWeightage = props => {
    const {activeModule, activeContext} = props;

    const history = useHistory();
    const location = useLocation();
    const {statementId} = useParams();

    const dispatch = useDispatch();

    const [{loading}, uploadWeightages] = usePromise(Api.uploadWeightages);

    const {statements} = useSelector(state => state.statement);
    const activeStatement = useMemo(() => {
        return statements.find(st => st.id === +statementId);
    }, [statementId, statements]);

    const {options} = useSelector(state => state.question);
    
    const [{
        loading: loadingQuestionStatements,
        result: questionStatementsResult,
    }, loadQuestionStatements] = usePromise(Api.getQuestionStatements);
    const [{
        loading: loadingOptionStatements,
        result: optionStatementsResult,
    }, loadOptionStatements] = usePromise(Api.getOptionStatements);

    const questionStatements = useMemo(() => {
        return questionStatementsResult?.results ?? [];
    }, [questionStatementsResult]);
    const optionStatements = useMemo(() => {
        return optionStatementsResult?.results ?? [];
    }, [optionStatementsResult]);

    const loadWeightages = useCallback(() => {
        loadQuestionStatements({
            version: 'latest',
            statement: statementId,
            limit: -1,
        });
        loadOptionStatements({
            version: 'latest',
            statement: statementId,
            limit: -1,
        });
    }, [statementId, loadOptionStatements, loadQuestionStatements]);

    useEffect(() => {
        loadWeightages();
    }, [loadWeightages]);

    const selectedQuestions = useMemo(() => {
        return location?.state?.selectedQuestions?.map(ques => {
            return {
                ...ques,
                weightage: questionStatements.find(quesSt => {
                    return quesSt.question === ques.id && quesSt.statement === +statementId;
                })?.weightage,
            };
        }) || [];
    }, [location, questionStatements, statementId]);

    useEffect(() => {
        if(!selectedQuestions?.length > 0) {
            history.push(`/administration/statements/${statementId}/`);
        }
        return () => {
            dispatch(resetWeightages());
        };
    }, [dispatch, history, selectedQuestions, statementId]);

    const [activeTab, setActiveTab] = useState('current');

    const [activeQuestion, setActiveQuestion] = useState(selectedQuestions[0]);
    const activeOptions = useMemo(() => {
        return options.filter(opt => opt.question === activeQuestion?.id).map(opt => {
            return {
                ...opt,
                weightage: optionStatements.find(optSt => optSt.option === opt.id)?.weightage,
            };
        });
    }, [options, activeQuestion, optionStatements]);

    const handleTabChange = useCallback(payload => {
        setActiveTab(payload.activeTab);
    }, []);

    const handleQuestionClick = useCallback(question => {
        setActiveQuestion(question);
    }, []);

    const [showFunctionInput, setShowFunctionInput] = useState(false);
    const handleFunctionToggle = useCallback(({value}) => {
        setShowFunctionInput(value);
    }, []);

    const {changedQuestions, changedOptions} = useSelector(state => state.admin); 
    const handleSaveClick = useCallback(async () => {
        try {
            const newQuestionStatements = questionStatements.reduce((acc, cur) => {
                const changedQuestion = changedQuestions.find(chQues => chQues.question === cur.question);
                if(changedQuestion) {
                    return [...acc, changedQuestion];
                }
                return [...acc, {question: cur.question, weightage: cur.weightage}];
            }, []);
            const newOptionStatements = optionStatements.reduce((acc, cur) => {
                const changedOption = changedOptions.find(chOpt => chOpt.option === cur.option);
                if(changedOption) {
                    return [...acc, changedOption];
                }
                return [...acc, {option: cur.option, weightage: cur.weightage}];
            }, []);

            await uploadWeightages(statementId, {
                version: 'initial',
                questions: newQuestionStatements,
                options: newOptionStatements,
            });
            Toast.show(_('Weightages have been successfully updated!'), Toast.SUCCESS);
            dispatch(resetWeightages());
            loadWeightages();
        } catch(error) {
            Toast.show(getErrorMessage(error) ?? _('An error occured'), Toast.DANGER);
            console.log(error);
        }
    }, [changedQuestions, changedOptions, uploadWeightages, statementId, dispatch, loadWeightages, questionStatements, optionStatements]);

    const renderHeaderControls = useCallback(() => {
        return (
            <div className={styles.addButton}>
                <BiPlusCircle className={styles.addIcon} />
                <Localize>Add variant</Localize>
            </div>
        );
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    <Link 
                        to={`/administration/statements/${statementId}/`} 
                        className={styles.backLink}
                    >
                        <BiChevronLeft 
                            size={22} 
                            className={styles.backIcon} 
                        />
                    </Link>
                    <div className={styles.titleContainer}>
                        <div className={styles.tagsContainer}>
                            <div className={styles.tag}>
                                {activeContext?.title}
                            </div>
                            <BsChevronRight className={styles.levelIcon} />
                            <div className={styles.tag}>
                                {activeModule?.title}
                            </div>
                        </div>
                        <h2 className={styles.statementTitle}>
                            {activeStatement?.title}
                        </h2>
                    </div>
                    <Button
                        className={styles.headerButton}
                        onClick={handleSaveClick}
                        loading={loading}
                        disabled={changedQuestions?.length === 0 && changedOptions?.length===0}
                    >
                        <Localize>Save</Localize>
                    </Button>
                </div> 
                <div className={styles.contentBody}>
                    <div className={styles.weightageSection}>
                        <Tabs 
                            activeTab={activeTab}
                            primary
                            className={styles.tabs}
                            PostHeaderComponent={renderHeaderControls}
                            headerContainerClassName={styles.headerContainer}
                            headerClassName={styles.tabsHeader}
                            tabItemClassName={styles.headerItem}
                            contentContainerClassName={styles.tabContent}
                            onChange={handleTabChange}
                        >
                            <Tab label="current" title={_('Current')}>
                                <div className={styles.tablesContainer}>
                                    <QuestionsTable
                                        loading={loadingQuestionStatements}
                                        selectedQuestions={selectedQuestions}
                                        onQuestionClick={handleQuestionClick}
                                        activeQuestion={activeQuestion}
                                    />
                                    <OptionsTable activeOptions={activeOptions} loading={loadingOptionStatements} />
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    <div className={styles.bottomSection}>
                        <div className={styles.bottomGroup}>
                            <div className={cs(styles.functionGroup, {[styles.functionGroupActive]: showFunctionInput})}>
                                <div className={styles.functionGroupInfo}>
                                    <h5 className={styles.functionGroupTitle}>
                                        <Localize>Enter your function</Localize>
                                    </h5>
                                    {!showFunctionInput && (
                                        <p className={styles.functionGroupText}>
                                            <Localize>Write your custom function to manage weightage</Localize>
                                        </p>
                                    )}
                                </div>
                                <ToggleSwitch size={48} onChange={handleFunctionToggle} />
                            </div>
                            {showFunctionInput ? (
                                <div className={styles.functionInputContainer}>
                                    <textarea className={styles.functionInput} />
                                </div>
                            ) : (
                                <div className={styles.insightsGroup}>
                                    <h5 className={styles.insightsGroupTitle}>
                                        <Localize>Insights</Localize>
                                    </h5>
                                    <InsightsTable />
                                </div>
                            )}
                        </div>
                        {showFunctionInput && (
                            <div className={styles.bottomGroup}>
                                <h5 className={styles.bottomGroupTitle}>
                                    <Localize>Insights</Localize>
                                </h5>
                                <InsightsTable />
                            </div>
                        )}
                        <div className={styles.bottomGroup}>
                            <div className={styles.bottomGroupHeader}>
                                <h5 className={styles.bottomGroupTitle}>
                                    <Localize>User feedbacks</Localize>
                                </h5>
                                <p className={styles.bottomGroupLink}>
                                    <Localize>See all feedbacks</Localize>
                                </p>
                            </div>
                            <FeedbackList statementId={activeStatement?.id} moduleId={activeModule?.id} contextId={activeContext?.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementWeightage;

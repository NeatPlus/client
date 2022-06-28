import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {useLocation, useParams, useHistory, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {BiChevronLeft, BiPlusCircle} from 'react-icons/bi';
import {BsChevronRight} from 'react-icons/bs';
import {RiTerminalBoxLine} from 'react-icons/ri';
import CodeEditor from '@uiw/react-textarea-code-editor';

import Button from 'components/Button';
import Tabs, {Tab} from 'components/Tabs';
import ToggleSwitch from '@ra/components/Form/ToggleSwitch';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';
import {calculateStatementScore} from 'utils/calculation';

import Api from 'services/api';
import {_} from 'services/i18n';
import Toast from 'services/toast';
import {resetWeightages} from 'store/actions/admin';

import QuestionsTable from './QuestionsTable';
import OptionsTable from './OptionsTable';
import InsightsTable from './InsightsTable';
import FeedbackList from './FeedbackList';
import styles from './styles.scss';

const initialFunctionCode = `/**
 * Returns the calculated score of
 * a statement based on related questions,
 * and answers.
 * params - {questions}
 * Each question consists of:
     {code} - Code of the question.
     {title} - Title of question.
     {weightage} - Weight assigned to question.
     {answerType} - AnswerType of the question.
       - 'single_option' or 'multiple_option'
     {options} - All options of the question.
 * Each option consists of:
     {code} - Code of the option.
     {title} - Title of the option.
     {weightage} - Weight assigned to option.
     {isSelected} - Whether or not the option
       has been selected as the answer.
 */
function calculateScore(questions) {
  let score=0;

  // Place your code here

  return score;
}

// DO NOT CHANGE OR REMOVE THE FOLLOWING LINE
return calculateScore(questions);
`;

const StatementWeightage = props => {
    const {activeModule, activeContext} = props;

    const history = useHistory();
    const location = useLocation();
    const {statementId} = useParams();

    const dispatch = useDispatch();

    const [{loading}, uploadWeightages] = usePromise(Api.uploadWeightages);
    const [{result, loading: loadingBaselineFeedbacks}, loadFeedbacks] = usePromise(Api.getFeedbacks);

    const [{loading: baselineSubmitting}, submitBaselineFeedbacks] = usePromise(Api.addBaselineFeedback);
    
    const [runningFunctionCode, setRunningFunctionCode] = useState(null);
    const [functionCode, setFunctionCode] = useState(initialFunctionCode);
    const handleFunctionChange = useCallback(e => {
        setFunctionCode(e.target.value);
    }, []);

    const [showFunctionInput, setShowFunctionInput] = useState(false);
    const handleFunctionToggle = useCallback(({value}) => {
        setShowFunctionInput(value);
        if(!value) {
            setRunningFunctionCode(null);
        }
    }, []);

    const handleRunFunctionCode = useCallback(() => {
        setRunningFunctionCode(functionCode);
    }, [functionCode]);

    const [{
        loading: loadingQuestionStatements,
        result: questionStatementsResult,
    }, loadQuestionStatements] = usePromise(Api.getQuestionStatements);
    const [{
        loading: loadingOptionStatements,
        result: optionStatementsResult,
    }, loadOptionStatements] = usePromise(Api.getOptionStatements);
    const [{
        result: statementFunctions,
    }, loadStatementFunctions] = usePromise(Api.getStatementFormula);

    useEffect(() => {
        if(statementFunctions?.results?.length > 0) {
            const functionFormulaObj = statementFunctions.results[0];
            if(functionFormulaObj) {
                const statementFunctionCode = functionFormulaObj.formula;
                setRunningFunctionCode(statementFunctionCode);
                setFunctionCode(statementFunctionCode);
                setShowFunctionInput(true);
            }
        }
    }, [statementFunctions, activeModule]);

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
        loadStatementFunctions({
            version: 'latest',
            statement: statementId,
            limit: -1,
            module: activeModule?.id,
        });
    }, [statementId, loadOptionStatements, loadQuestionStatements, loadStatementFunctions, activeModule]);

    useEffect(() => {
        if(activeModule) {
            loadWeightages();
        }
    }, [loadWeightages, activeModule]);

    const questionStatements = useMemo(() => {
        return questionStatementsResult?.results ?? [];
    }, [questionStatementsResult]);
    const optionStatements = useMemo(() => {
        return optionStatementsResult?.results ?? [];
    }, [optionStatementsResult]);

    const {changedQuestions, changedOptions, baselineSurveyAnswers} = useSelector(state => state.admin);
    const {questions, options} = useSelector(state => state.question);

    const newQuestionStatements = useMemo(() => {
        if(changedQuestions.length < 1) {
            return questionStatements?.map(qst => ({question: qst.question, weightage: qst.weightage})) || [];
        }
        const unchangedQuestionStatements = questionStatements.reduce((acc, cur) => {
            if(changedQuestions.some(chQues => chQues.question === cur.question)) {
                return acc;
            }
            return [...acc, {question: cur.question, weightage: cur.weightage}];
        }, []);
        return [...changedQuestions, ...unchangedQuestionStatements];
    }, [questionStatements, changedQuestions]);

    const newOptionStatements = useMemo(() => {
        if(changedOptions.length < 1) {
            return optionStatements?.map(optst => ({option: optst.option, weightage: optst.weightage})) || [];
        }
        const unchangedOptionStatements = optionStatements.reduce((acc, cur) => {
            if(changedOptions.some(chOpt => chOpt.option === cur.option)) {
                return acc;
            }
            return [...acc, {option: cur.option, weightage: cur.weightage}];
        }, []);
        return [...changedOptions, ...unchangedOptionStatements];
    }, [optionStatements, changedOptions]);

    const hasChangedFunction = useMemo(() => {
        const currentStatementObj = statementFunctions?.results?.[0];
        if(!currentStatementObj) {
            return !!runningFunctionCode;
        }
        return currentStatementObj.formula !== runningFunctionCode;
    }, [runningFunctionCode, statementFunctions]);

    useEffect(() => {
        if(statementId && activeModule?.id && activeContext?.id) {
            loadFeedbacks({
                survey_result__statement: statementId,
                survey_result__module: activeModule.id,
                survey_result__module__context: activeContext.id,
                is_baseline: true,
            });
        }
    }, [statementId, activeModule, activeContext, loadFeedbacks]);

    const [baselineFeedbackData, setBaselineFeedbackData] = useState([]);
    const loadBaselineFeedbackData = useCallback(async () => {
        try {
            const data = await Promise.all(result?.results?.map(async baselineFeedback => {
                const baselineAnswers = baselineSurveyAnswers.find(ans => ans.survey === baselineFeedback.surveyId)?.surveyAnswers || [];
                let actualScore = baselineFeedback.actualScore;
                if(questions?.[activeModule.code]?.length > 0) {
                    actualScore = await calculateStatementScore({
                        surveyAnswers: baselineAnswers,
                        relevantQuestionStatements: newQuestionStatements,
                        relevantOptionStatements: newOptionStatements,
                        questions,
                        options,
                        moduleCode: activeModule.code,
                        customFunction: runningFunctionCode,
                    });
                }
                return {
                    ...baselineFeedback,
                    actualScore: Number(actualScore)?.toFixed(2) || '-',
                    expectedScore: Number(baselineFeedback.expectedScore)?.toFixed(2) || '-',
                };
            }) || []);
            setBaselineFeedbackData(data);
        } catch(err) {
            console.log(err);
        }
    }, [activeModule, baselineSurveyAnswers, runningFunctionCode, result, newOptionStatements, newQuestionStatements, options, questions]);

    useEffect(() => {
        if(options.length > 0) {
            loadBaselineFeedbackData();
        }
    }, [loadBaselineFeedbackData, options]);

    const {sumOfSquare = '-', standardDeviation = '-'} = useMemo(() => {
        if(baselineFeedbackData?.length > 0) {
            const differences = baselineFeedbackData.map(dt => dt.actualScore - dt.expectedScore);
            const meanDifference = differences.reduce((acc, cur) => acc += cur, 0) / differences.length;
            let variance = 0;
            if(differences.length > 0) {
                variance = differences.reduce((acc, cur) => acc += (cur - meanDifference)**2, 0) / (differences.length);
            }
            return {
                sumOfSquare: Number(differences.reduce((acc, cur) => acc += cur**2, 0)).toFixed(2),
                standardDeviation: Number(Math.sqrt(variance)).toFixed(2),
            };
        }
        return {};
    }, [baselineFeedbackData]);

    const {statements} = useSelector(state => state.statement);
    const activeStatement = useMemo(() => {
        return statements.find(st => st.id === +statementId);
    }, [statementId, statements]);

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

    const handleSaveClick = useCallback(async () => {
        try {
            let formData = {module: activeModule?.id, questionGroup: null};
            const hasChangedWeightage = changedQuestions?.length > 0 || changedOptions?.length > 0;
            if(hasChangedFunction) {
                formData.formula = runningFunctionCode;
                formData.questions = newQuestionStatements;
                formData.options = newOptionStatements;
            } else if(hasChangedWeightage) {
                formData.questions = newQuestionStatements;
                formData.options = newOptionStatements;
            } else {
                return Toast.show(_('No changes to save!'), Toast.DANGER);
            }
            await uploadWeightages(statementId, formData);
            Toast.show(_('Your changes have been successfully updated!'), Toast.SUCCESS);
            dispatch(resetWeightages());
            const newFeedbacks = baselineFeedbackData?.map(feedback => ({
                actualScore: feedback.actualScore,
                comment: feedback.comment,
                expectedScore: feedback.expectedScore,
                surveyResult: feedback.surveyResult,
            })) || [];
            await submitBaselineFeedbacks(newFeedbacks);
            loadWeightages();
        } catch(error) {
            Toast.show(getErrorMessage(error) ?? _('An error occured'), Toast.DANGER);
            console.log(error);
        }
    }, [
        hasChangedFunction,
        runningFunctionCode,
        newQuestionStatements,
        newOptionStatements,
        uploadWeightages,
        statementId,
        dispatch,
        loadWeightages,
        baselineFeedbackData,
        submitBaselineFeedbacks,
        activeModule,
        changedQuestions,
        changedOptions,
    ]);

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
                        loading={loading || baselineSubmitting}
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
                                <ToggleSwitch value={showFunctionInput} size={48} onChange={handleFunctionToggle} />
                            </div>
                            {showFunctionInput ? (
                                <div className={styles.functionInputContainer}>
                                    <div className={cs(styles.runButtonContainer, {[styles.runButtonContainerWarning]: runningFunctionCode !== functionCode})}>
                                        <RiTerminalBoxLine className={styles.terminalIcon} size={18} />
                                        {runningFunctionCode !== functionCode && (
                                            <span className={styles.warningText}>
                                                <Localize>
                                                    Unapplied changes!
                                                </Localize>
                                            </span>
                                        )}
                                        <Button
                                            onClick={handleRunFunctionCode}
                                            className={cs(styles.runButton, {
                                                [styles.runButtonWarning]: runningFunctionCode !== functionCode,
                                                [styles.runButtonDisabled]: runningFunctionCode === functionCode,
                                            })}
                                        >
                                            <Localize>APPLY</Localize>
                                        </Button>
                                    </div>
                                    <CodeEditor
                                        value={functionCode}
                                        onChange={handleFunctionChange}
                                        prefixCls="light-mode"
                                        language="js"
                                        className={styles.functionInput}
                                        minHeight={360}
                                        padding={20}
                                        style={{
                                            backgroundColor: '#eff3f5',
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={styles.insightsGroup}>
                                    <h5 className={styles.insightsGroupTitle}>
                                        <Localize>Insights</Localize>
                                    </h5>
                                    <InsightsTable
                                        loading={loadingBaselineFeedbacks}
                                        feedbackData={baselineFeedbackData}
                                        sumOfSquare={sumOfSquare}
                                        standardDeviation={standardDeviation}
                                    />
                                </div>
                            )}
                        </div>
                        {showFunctionInput && (
                            <div className={styles.bottomGroup}>
                                <h5 className={styles.bottomGroupTitle}>
                                    <Localize>Insights</Localize>
                                </h5>
                                <InsightsTable
                                    loading={loadingBaselineFeedbacks}
                                    feedbackData={baselineFeedbackData}
                                    sumOfSquare={sumOfSquare}
                                    standardDeviation={standardDeviation}
                                />
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
                            <FeedbackList
                                statementId={activeStatement?.id}
                                moduleId={activeModule?.id}
                                contextId={activeContext?.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementWeightage;

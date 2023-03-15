import store from 'store';
import {uuidv4} from '@ra/utils';

import WorkerBuilder from './workerBuilder';
import CalculationWorker from './calculationWorker';

let myWorker = new WorkerBuilder(CalculationWorker);

export const calculateStatementScore = async ({
    surveyAnswers,
    relevantQuestionStatements,
    relevantOptionStatements,
    questions,
    options,
    moduleCode,
    customFunction,
}) => {
    if(customFunction) {
        try {
            const safeCalculate = async (relevantQuestions) => {
                return new Promise((resolve, reject) => {
                    const onMessage = e => {
                        const {id: _id, score} = e.data;
                        if(id === _id) {
                            clearTimeout(timeout);
                            myWorker.removeEventListener('message', onMessage);
                            return resolve(score);
                        }
                    }; 
                    const timeout = setTimeout(() => {
                        myWorker.terminate();
                        alert('Your code runtime has been terminated. Please check for infinite loops or long-running operations. Please close the tab or browser, and re-open to restore functionality. If you are not an administrator, please contact NeatPlus about this issue.');
                        myWorker.removeEventListener('message', onMessage);
                        return reject();
                    }, 100);
                    myWorker.addEventListener('message', onMessage);
                    myWorker.addEventListener('error', e => {
                        clearTimeout(timeout);
                        return reject();
                    });
                    myWorker.addEventListener('messageerror', e => {
                        clearTimeout(timeout);
                        return reject();
                    });
                    const id = uuidv4();
                    myWorker.postMessage({customFunction, relevantQuestions, id});
                });
            };
 
            const relevantQuestions = questions?.[moduleCode]?.reduce((acc, cur) => {
                const questionWght = relevantQuestionStatements.find(quesSt => quesSt.question === cur.id)?.weightage;
                const optionsData = options.filter(opt => opt.question === cur.id);
                const answerObj = surveyAnswers.find(ans => ans.question === cur.id);
                const relevantOptions = optionsData.reduce((optAcc, optCur) => {
                    const optionWght = relevantOptionStatements.find(optSt => optSt.option === optCur.id)?.weightage;
                    const isSelectedOption = answerObj?.options?.some(optAns => optAns === optCur.id);
                    if(optionWght) {
                        optAcc.push({
                            code: optCur.code,
                            title: optCur.title,
                            weightage: optionWght,
                            isSelected: isSelectedOption,
                        });
                        return optAcc;
                    }
                    return optAcc;
                }, []);
                if(questionWght) {
                    acc.push({
                        code: cur.code,
                        answerType: cur.answerType,
                        title: cur.title,
                        weightage: questionWght,
                        options: relevantOptions,
                    });
                    return acc;
                }
                return acc;
            }, []);
            const score = await safeCalculate(relevantQuestions);
            return score;
        } catch(error) {
            return NaN;
        }
    }
    
    let score = 0;
    if(relevantQuestionStatements?.length) {
        const questionWeights = relevantQuestionStatements.reduce((acc, cur) => {
            const curQuestionAnswer = surveyAnswers.find(ans => {
                return ans.question === cur.question;
            });
            const allOptionWeights = options
                .filter(opt => opt.question === cur.question)
                .map(opt => relevantOptionStatements.find(optSt => {
                    return optSt.option === opt.id;
                })?.weightage || 0);
            const maxOptionWeight = Math.max(...allOptionWeights);
            const optionScores = curQuestionAnswer?.options?.map(opt => {
                return relevantOptionStatements.find(optSt => 
                    optSt.option === opt
                )?.weightage;
            }) || [];
            const currentQuestion = questions[moduleCode].find(que => que.id === cur.question);
            if(!currentQuestion) {
                return acc;
            }
            if(currentQuestion.answerType === 'single_option') {
                const questionValue = (optionScores[0] * cur.weightage) / maxOptionWeight;
                return (
                    acc.sum = acc.sum + cur.weightage, 
                    acc.score = isNaN(questionValue) ? acc.score : acc.score + questionValue,
                    acc
                );
            }
            const maxSelected = Math.max(...optionScores);
            const sumSelected = optionScores.reduce(
                (selectedScoreAcc, curSelectedScore) => selectedScoreAcc + curSelectedScore, 0
            );
            const totalWeight = options
                .filter(opt => opt.question === cur.question)
                .reduce((optionAcc, curOption) => {
                    const curOptionStatement = relevantOptionStatements.find(el => 
                        el.option === curOption.id
                    );
                    return (curOptionStatement?.weightage || 0) + optionAcc;
                }, 0);
            let den = totalWeight - maxSelected;
            const questionValue = (maxSelected + (
                (sumSelected - maxSelected) / den
            ) * (1 - maxSelected) || 1) * cur.weightage;
            return (
                acc.sum = acc.sum + cur.weightage,
                acc.score = isNaN(questionValue) ? acc.score : acc.score + questionValue,
                acc
            );
        }, {sum: 0, score: 0});

        score = questionWeights.sum === 0
            ? questionWeights.score
            : questionWeights.score / questionWeights.sum;
    }
    return score;
};

export const calculateSurveyResults = async (surveyAnswers, moduleCode = 'sens') => {
    const {
        statement: {statements},
        weightage: {questionStatements, optionStatements, statementFunctions},
        question: {options, questions},
        context: {modules},
    } = store.getState();

    const activeModule = modules.find(mod => mod.code === moduleCode);

    const results = await Promise.all(statements.map(async (st, idx) => {
        const weightedQuestionStatements = questionStatements.filter(qst => 
            qst.statement === st.id
        );

        const weightedOptionStatements = optionStatements.filter(optSt => optSt.statement === st.id);
        const customFunction = statementFunctions.find(stFunc => stFunc.statement === st.id && stFunc.module === activeModule.id);

        const score = await calculateStatementScore({
            surveyAnswers,
            relevantQuestionStatements: weightedQuestionStatements,
            relevantOptionStatements: weightedOptionStatements,
            questions,
            options,
            moduleCode,
            customFunction: customFunction?.formula,
        });
        
        return {
            statement: st.id,
            score: score,
            module: activeModule.id,
        };
    }));
    return results;
};

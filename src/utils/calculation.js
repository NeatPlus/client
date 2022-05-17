import store from 'store';

export const calculateSurveyResults = (surveyAnswers, moduleCode = 'sens') => {
    const {
        statement: {statements},
        weightage: {questionStatements, optionStatements},
        question: {options, questions},
        context: {modules},
    } = store.getState();

    const activeModule = modules.find(mod => mod.code === moduleCode);

    const results = statements.map((st, idx) => {
        const weightedQuestions = questionStatements.filter(qst => 
            qst.statement === st.id
        );
        let score = 0;
        if(weightedQuestions?.length) {
            const questionWeights = weightedQuestions.reduce((acc, cur) => {
                const curQuestionAnswer = surveyAnswers.find(ans => {
                    return ans.question === cur.question;
                });
                const allOptionWeights = options
                    .filter(opt => opt.question === cur.question)
                    .map(opt => optionStatements.find(optSt => {
                        return optSt.option === opt.id && optSt.statement === st.id;
                    })?.weightage || 0);
                const maxOptionWeight = Math.max(...allOptionWeights);
                const optionScores = curQuestionAnswer?.options.map(opt => {
                    return optionStatements.find(optSt => 
                        optSt.option === opt && optSt.statement === st.id
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
                        const curOptionStatement =  optionStatements.find(el => 
                            el.option === curOption.id && el.statement === st.id
                        );
                        return (curOptionStatement?.weightage || 0) + optionAcc;
                    }, 0);
                let den = (totalWeight - maxSelected) * (1 - maxSelected) || 1;
                const questionValue = (maxSelected + (
                    (sumSelected - maxSelected) / den
                )) * cur.weightage;
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

        return {
            statement: st.id,
            score: score,
            module: activeModule.id,
        };
    });
    return results;
};

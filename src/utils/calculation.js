import store from 'store';

export const calculateSurveyResults = (surveyAnswers) => {
    const {
        statement: {statements},
        weightage: {questionStatements, optionStatements},
        question: {options},
    } = store.getState();

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
                const optionScores = curQuestionAnswer?.options.map(opt => {
                    return optionStatements.find(optSt => 
                        optSt.option === opt
                    )?.weightage;
                }) || [];
                if(optionScores.length <= 1) {
                    const questionValue = optionScores[0] * cur.weightage;
                    return (
                        acc.sum = acc.sum + cur.weightage, 
                        acc.score = acc.score + (
                            isNaN(questionValue) ? 0 : questionValue
                        ),
                        acc
                    );
                }
                const maxSelected = Math.max(...optionScores);
                const sumSelected = optionScores.reduce(
                    (selectedScoreAcc, curSelectedScore) => 
                        selectedScoreAcc + curSelectedScore, 0
                );
                const totalWeight = options
                    .filter(opt => opt.question === cur.question)
                    .reduce((optionAcc, curOption) => {
                        const curOptionStatement =  optionStatements.find(el => 
                            el.option === curOption.id
                        );
                        return curOptionStatement?.weightage || 0 + optionAcc;
                    }, 0);
                let den = (totalWeight - maxSelected) * (1 - maxSelected) || 1;
                const questionValue = maxSelected + (
                    (sumSelected - maxSelected) / den
                );
                return (
                    acc.sum = acc.sum + cur.weightage,
                    acc.score = acc.score + questionValue,
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
        };
    });
    return results;
};

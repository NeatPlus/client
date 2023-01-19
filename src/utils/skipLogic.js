import store from 'store';

const regExp = /^\${(.+)}\W*(includes|==|!=)\W*\${(.+)}/;

const operatorFunctions = {
    '==': function(answer, optionCode) {
        const {question: {options = []}} = store.getState();
        if(answer.answerType === 'single_option') {
            const answeredOption = options.find(opt => answer?.options?.[0] && opt.id === answer.options[0]);
            return answeredOption && answeredOption.code === optionCode;
        }
        return false;
    },
    '!=': function(answer, optionCode) {
        const {question: {options = []}} = store.getState();
        if(answer?.answerType === 'single_option') {
            const answeredOption = options.find(opt => answer?.options?.[0] && opt.id === answer.options[0]);
            return answeredOption && answeredOption.code !== optionCode;
        }
        return true;
    },
    'includes': function(answer, optionCode) {
        const {question: {options = []}} = store.getState();
        if(['single_option', 'multiple_option'].includes(answer?.answerType)) {
            const answeredOptionCodes = (answer?.options || []).map(ansOpt => {
                return options.find(opt => opt.id === ansOpt)?.code;
            }).filter(optCode => Boolean(optCode));
            return answeredOptionCodes.includes(optionCode);
        }
        return false;
    }
};

const returnFalse = () => false;

export function parseSkipLogic(skipLogic='', {questions=[], answers=[]}) {
    const match = skipLogic.match(regExp) || [];
    const [, questionCode, operator, optionCode] = match;

    const operatorFunction = operatorFunctions[operator] || returnFalse;
    
    const question = questions.find(ques => ques.code === questionCode);
    if(!question) {
        return false;
    }
    const answerData = answers.find(ans => ans.question === question.id);
    if(answerData) {
        return operatorFunction(answerData, optionCode);
    }
    return operator === '!=';
}

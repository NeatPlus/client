// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    // eslint-disable-next-line no-restricted-globals
    self.onmessage = function(e) {
        let evalFunc = new Function('questions', e.data.customFunction); //eslint-disable-line no-new-func
        const score = evalFunc(e.data.relevantQuestions);
        postMessage({score, id: e.data.id});
    };
};

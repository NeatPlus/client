// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

class WorkerMock {
    constructor(stringUrl) {
        this.url = stringUrl;
        this.onmessage = () => {};
    }

    postMessage(msg) {
        this.onmessage(msg);
    }
}

window.Worker = WorkerMock;
global.URL.createObjectURL = jest.fn();

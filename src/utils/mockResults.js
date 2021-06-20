import store from 'store';

import {getSeverityFromScore} from './severity';

export const getMockResults = () => {
    const {statement: {statements}} = store.getState();

    return statements.map(st => {
        const randScore = +Math.random().toFixed(2);
        return {
            statement: st.id,
            topic: st.topic,
            score: randScore,
            severity: getSeverityFromScore(randScore),
        };
    });
};

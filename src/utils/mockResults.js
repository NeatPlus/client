import store from 'store';

export const getMockResults = () => {
    const {statement: {statements}} = store.getState();

    return statements.map(st => ({
        statement: st.id,
        topic: st.topic,
        score: +Math.random().toFixed(2),
    }));
};

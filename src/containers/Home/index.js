import React from 'react';

import styles from './styles.module.scss';

const Home = () => {
    return (
        <div className={styles.container}>
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                Learn React
            </a>
        </div>
    );
};

export default Home;

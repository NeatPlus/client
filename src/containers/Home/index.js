import styles from './styles.scss';

import Button from '@ra/components/Button';

const Home = () => {
    return (
        <div className={styles.containerHome}>
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                Learn React
            </a>
            <Button>My Button</Button>
        </div>
    );
};

export default Home;

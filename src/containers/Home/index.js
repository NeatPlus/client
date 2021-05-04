import styles from './styles.scss';

import Button from 'components/Button';
import Tabs, {Tab} from 'components/Tabs';

const Home = () => {
    return (
        <div className={styles.containerHome}>
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                Learn React
            </a>
            <Button className={styles.button}>Test Button</Button>
            <Tabs className={styles.tabs}>
                <Tab label="tab1" title="Tab 1">
                    Testing Tab 1 Content
                </Tab>
                <Tab label="tab2" title="Tab 2">
                    Testing Tab 2 Content
                </Tab>
            </Tabs>
        </div>
    );
};

export default Home;

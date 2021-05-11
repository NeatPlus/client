import {Link} from 'react-router-dom';

import styles from './styles.scss';

import Button from 'components/Button';

const Home = () => {
    return (
        <div className={styles.containerHome}>
            <Link to="/login">
                <Button className={styles.button}>Go to Login</Button>
            </Link>
            <Link to="/projects">
                <Button className={styles.button}>Go to projects</Button>
            </Link>
        </div>
    );
};

export default Home;

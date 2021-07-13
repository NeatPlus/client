import {Link} from 'react-router-dom';
import {HiArrowNarrowLeft} from 'react-icons/hi';

import NavBar from 'components/NavBar';
import Button from 'components/Button';

import image from 'assets/images/404.svg';

import styles from './styles.scss';

const Error404 = () => {
    return (
        <div className={styles.container}>
            <NavBar dark />
            <section className={styles.section}>
                <img src={image} alt="404" />  
                <h3 className={styles.sectionTitle}>Page not found!</h3>
                <Link to="/">
                    <Button className={styles.button}>
                        <HiArrowNarrowLeft className={styles.arrowIcon} />
                        Back to Home                
                    </Button>
                </Link>
            </section>
        </div>
    );
};

export default Error404;

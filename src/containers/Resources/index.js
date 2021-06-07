import CategorySection from './CategorySection';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';

import styles from './styles.scss';

const Resources = () => {
    return (
        <div className={styles.containerResources}>
            <header className={styles.header}>
                <NavBar />
                <div className={styles.hero}>
                    <div className={styles.titles}>
                        <h1 className={styles.title}>Resources & Support</h1>
                    </div>
                </div>
            </header>
            <CategorySection />
            <Footer />
        </div>
    );
};

export default Resources;

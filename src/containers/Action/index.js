import CountrySection from './CountrySection';

import header from 'assets/images/neat-in-action-header.webp';
import Footer from 'components/Footer';
import NavBar from 'components/NavBar';

import styles from './styles.scss';
import VideoModal from 'components/VideoModal';
import { useCallback, useState } from 'react';

const Action = () => {
    const [showVideoModal, setShowVideoModal] = useState(false);

    const handleShowVideoModal = useCallback(() => setShowVideoModal(true), []);
    const handleHideVideoModal = useCallback(
        () => setShowVideoModal(false),
        []
    );
    return (
        <>
            <div className={styles.containerAbout}>
                <header className={styles.header}>
                    <NavBar />
                    <div className={styles.hero}>
                        <div className={styles.heroInfo}>
                            <p className={styles.pageTitle}>NEAT+ IN ACTION</p>
                            <h1 className={styles.heroTitle}>
                                NEAT+ Around the <br />
                                World
                            </h1>
                            <p className={styles.heroDesc}>
                                To date, the NEAT+ has been successfully tested
                                and applied by over ten humanitarian
                                organization in around 20 field operations
                                worldwide.See examples and links to the findings
                                of previous worldwide. See examples and links to
                                the findings of previous NEAT+ environment
                                scoping missions on this page. If you would like
                                to submit a case study for inclusion on this
                                page, please let us know through the Contact
                                page.
                            </p>
                        </div>
                        <img
                            className={styles.heroImage}
                            src={header}
                            alt='neat+-in-action-header'
                            onClick={handleShowVideoModal}
                        />
                    </div>
                </header>
                <CountrySection />
                <Footer />
            </div>
            <VideoModal
                videoUrl='https://www.youtube.com/embed/oOYMwEU-g24'
                isVisible={showVideoModal}
                onClose={handleHideVideoModal}
                title='Applying the Nexus Environmental Assessment Tool (NEAT+) in humanitarian settings'
            />
        </>
    );
};

export default Action;

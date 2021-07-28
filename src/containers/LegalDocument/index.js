import {useCallback} from 'react';
import {useSelector} from 'react-redux';

import parse from 'html-react-parser';

import Container from 'components/Container';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';

import Tabs, {Tab} from '@ra/components/Tabs';
import cs from '@ra/cs';

import styles from './styles.scss';

const LegalDocument = (props) => {
    const {legislations} = useSelector((state) => state.legislation);
    const renderTabsHeader = useCallback(tabHeaderProps => {
        const {title, active, ...rest} = tabHeaderProps;

        return (
            <div className={cs(styles.headerItem, {
                [styles.headerItemActive]: active,
            })} {...rest}>
                <div className={styles.headerTitle}>
                    <span className={styles.tabLabel}>{title}</span>
                </div>
            </div>
        );
    }, []);
    return (
        <section>
            <NavBar dark />
            <Container jumbotron>
                <Tabs
                    className={styles.tabs}
                    renderHeader={renderTabsHeader}
                    headerClassName={styles.tabsHeader}
                    contentContainerClassName={styles.contentContainer}
                    defaultActiveTab={props.location.title || 'terms-and-conditions'}
                >
                    {legislations.map(item =>
                        <Tab
                            key={item?.id}
                            label={item?.documentType}
                            title={item?.documentType.split('-').join(' ')}
                            className={styles.tabContent}
                        >
                            {parse(String(item?.description || ''))}
                        </Tab>
                    )}
                </Tabs>
            </Container>
            <Footer />
        </section>
    );
};

export default LegalDocument;

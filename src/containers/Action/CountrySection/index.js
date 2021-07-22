import {createRef, useEffect, useMemo, useState, useCallback} from 'react';

import Container from 'components/Container';

import Api from 'services/api';

import CountryWorkCard from '../CountryWorkCard';
import CountryWorkModal from '../CountryWorkModal';
import WorldMap from '../Worldmap';

import styles from './styles.scss';

const CountrySection = () => {
    const [allActions, setAllActions] = useState([]);
    const [showWorkModal, setShowWorkModal] = useState(false);
    const [workModalData, setWorkModalData] = useState();

    const handleToggle = useCallback((data) => {
        setWorkModalData(data);
        setShowWorkModal(!showWorkModal);
    }, [showWorkModal]);


    useEffect(() => {
        async function fetchAllAction() {
            const {results} = await Api.get('/action/');
            setAllActions(results);
        }
        fetchAllAction();
    }, []);

    const refs = useMemo(
        () =>
            Array(allActions.length)
                .fill()
                .map(() => createRef()),
        [allActions]
    );

    return (
        <div className={styles.countryContainer}>
            <Container jumbotron>
                <div className={styles.countrySection}>
                    <div className={styles.worldMap}>
                        <div className={styles.worldMapCont}>
                            <WorldMap allActions={allActions} refs={refs} />
                        </div>
                    </div>
                    <div className={styles.cards}>
                        {allActions.map((data, i) => (
                            <div ref={refs[i]} key={data.id} id={data.id}>
                                <CountryWorkCard
                                    item={data}
                                    toggleWorkModal={handleToggle}
                                />
                            </div>
                        ))}
                    </div>
                    <CountryWorkModal
                        isVisible={showWorkModal}
                        item={workModalData}
                        onClose={handleToggle}
                    />
                </div>
            </Container>
        </div>
    );
};

export default CountrySection;

import {createRef, useEffect, useMemo, useState} from 'react';

import Api from 'services/api';
import CountryWorkCard from '../CountryWorkCard';
import WorldMap from '../Worldmap';

import styles from './styles.scss';

const CountrySection = () => {
    const [allActions, setAllActions] = useState([]);

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
        <div className={styles.container}>
            <div className={styles.worldMap}>
                <div className={styles.worldMapCont}>
                    <WorldMap allActions={allActions} refs={refs} />
                </div>
            </div>
            <div className={styles.cards}>
                {allActions.map((data, i) => (
                    <div ref={refs[i]} key={data.id} id={data.id}>
                        <CountryWorkCard
                            title={data.title}
                            organization={data.organization}
                            description={data.summary}
                            contextTitle={data.contextTitle}
                            modalDescription={data.description}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountrySection;

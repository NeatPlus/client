import {useCallback, useEffect, useState} from 'react';
import Marks from './Marks';

const Map = ({
    width,
    color,
    backgroundColor,
    zambiaRef,
    ugandaRef,
    myanmarRef,
    colombiaRef,
}) => {
    const [name, setName] = useState('');
    const [data, setData] = useState('');
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        const setPositionFromEvent = (e) =>
            setPosition({x: e.clientX, y: e.clientY});
        window.addEventListener('mousemove', setPositionFromEvent);

        return () => {
            window.removeEventListener('mousemove', setPositionFromEvent);
        };
    }, []);

    useEffect(() => {
        fetch(
            'https://raw.githubusercontent.com/saugatdhimal/worldmap/main/world-map.json'
        )
            .then((data) => data.json())
            .then((data) => setData(data));
    }, []);

    const countryName = useCallback((value) => {
        setName(value);
    }, []);

    if (!data) {
        return null;
    }

    return (
        <>
            <div
                style={{
                    display: `${name ? 'flex' : 'none'}`,
                    zIndex: 1,
                    position: 'fixed',
                    top: position.y - 5,
                    left: position.x + 15,
                    padding: '1px 7px 3px 7px',
                    backgroundColor: 'gray',
                    color: 'white',
                }}
            >
                {name && name}
            </div>
            <svg
                width={width}
                height={width / 1.4}
                style={{backgroundColor: backgroundColor}}
            >
                <Marks
                    data={data}
                    width={width}
                    color={color}
                    countryName={countryName}
                    zambiaRef={zambiaRef}
                    ugandaRef={ugandaRef}
                    myanmarRef={myanmarRef}
                    colombiaRef={colombiaRef}
                />
            </svg>
        </>
    );
};

export default Map;

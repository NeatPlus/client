import {useCallback, useEffect, useState} from 'react';
import Marks from './Marks';

const Map = ({width, color, backgroundColor, refs, allActions}) => {
    const [text, setText] = useState('');
    const [data, setData] = useState('');
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        fetch(
            'https://raw.githubusercontent.com/saugatdhimal/worldmap/main/world-map.json'
        )
            .then((data) => data.json())
            .then((data) => setData(data));
    }, []);

    const handleShowToolTip = useCallback((e, value) => {
        setPosition({x: e.clientX, y: e.clientY});
        setText(value);
    }, []);

    const handleHideToolTip = useCallback(() => {
        setPosition({x: 0, y: 0});
        setText('');
    }, []);

    if (!data) {
        return null;
    }

    return (
        <>
            <div
                style={{
                    display: `${text ? 'flex' : 'none'}`,
                    zIndex: 1,
                    position: 'fixed',
                    top: position.y - 5,
                    left: position.x + 15,
                    padding: '1px 7px 3px 7px',
                    backgroundColor: 'gray',
                    color: 'white',
                }}
            >
                {text && text}
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
                    refs={refs}
                    allActions={allActions}
                    handleShowToolTip={handleShowToolTip}
                    handleHideToolTip={handleHideToolTip}
                />
            </svg>
        </>
    );
};

export default Map;

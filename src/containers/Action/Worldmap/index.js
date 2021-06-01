import {useEffect, useRef, useState} from 'react';
import Map from './Map';

function WorldMap({zambiaRef, ugandaRef, myanmarRef, colombiaRef}) {
    const [width, setWidth] = useState(0);
    const parentRef = useRef(null);

    useEffect(() => {
        function handleResize() {
            setWidth(parentRef.current.offsetWidth);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div
            ref={parentRef}
            style={{
                width: '100%',
            }}
        >
            <Map
                width={width}
                backgroundColor='#d9d9d9'
                color='white'
                zambiaRef={zambiaRef}
                ugandaRef={ugandaRef}
                myanmarRef={myanmarRef}
                colombiaRef={colombiaRef}
            />
        </div>
    );
}

export default WorldMap;

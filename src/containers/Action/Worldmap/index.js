import {useEffect, useRef, useState} from 'react';
import Map from './Map';

function WorldMap({refs, allActions}) {
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
                refs={refs}
                allActions={allActions}
            />
        </div>
    );
}

export default WorldMap;

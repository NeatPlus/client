import {useCallback, useEffect, useState} from 'react';
import {geoMercator, geoPath} from 'd3';

const Marks = ({
    data,
    width,
    color,
    refs,
    allActions,
    handleShowToolTip,
    handleHideToolTip,
}) => {
    const [marker, setMarker] = useState(1);
    const projection = geoMercator()
        .scale(width / 6.4)
        .translate([width / 2, width / 2]);

    const path = geoPath(projection);

    const setMarkerFromScroll = useCallback(() => {
        for (let i = 0; i < refs.length; i++) {
            if (refs[i].current.offsetTop - window.pageYOffset > -40) {
                setMarker(refs[i].current.id);
                break;
            }
        }
    }, [refs]);

    useEffect(() => {
        setMarkerFromScroll();
        window.addEventListener('scroll', setMarkerFromScroll);

        return () => {
            window.removeEventListener('scroll', setMarkerFromScroll);
        };
    }, [setMarkerFromScroll]);

    const scrollToRef = useCallback((ref) => {
        window.scrollTo(0, ref.current.offsetTop - 120);
    }, []);

    const handleClick = useCallback(
        (id) => {
            for (let i = 0; i < refs.length; i++) {
                if (parseInt(refs[i].current.id) === parseInt(id)) {
                    scrollToRef(refs[i]);
                    break;
                }
            }
        },
        [refs, scrollToRef]
    );

    return (
        <>
            <g fill={color}>
                {data.features.map((feature) => {
                    return (
                        <path
                            fill={color}
                            d={path(feature)}
                            key={feature.properties.name}
                        />
                    );
                })}
            </g>
            <g>
                {allActions.map((data) => (
                    <svg
                        key={data.id}
                        width={
                            parseInt(data.id) === parseInt(marker) ? '24' : '20'
                        }
                        height='24'
                        viewBox='0 0 24 24'
                        cursor='pointer'
                        x={
                            projection(data.point.coordinates)[0] -
                            (parseInt(data.id) === parseInt(marker) ? 12 : 10)
                        }
                        y={
                            projection(data.point.coordinates)[1] -
                            (parseInt(data.id) === parseInt(marker) ? 24 : 22)
                        }
                        onMouseEnter={(e) => handleShowToolTip(e, data.title)}
                        onMouseOut={() => handleHideToolTip()}
                        fill={
                            parseInt(data.id) === parseInt(marker)
                                ? '#00a297'
                                : 'gray'
                        }
                        onClick={() => handleClick(data.id)}
                    >
                        <g transform='translate(0 -1028.4)'>
                            <path
                                d='m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z'
                                transform='translate(0 1028.4)'
                            />
                            <path
                                d='m12 3c-2.7614 0-5 2.2386-5 5 0 2.761 2.2386 5 5 5 2.761 0 5-2.239 5-5 0-2.7614-2.239-5-5-5zm0 2c1.657 0 3 1.3431 3 3s-1.343 3-3 3-3-1.3431-3-3 1.343-3 3-3z'
                                transform='translate(0 1028.4)'
                            />
                        </g>
                    </svg>
                ))}
            </g>
        </>
    );
};

export default Marks;

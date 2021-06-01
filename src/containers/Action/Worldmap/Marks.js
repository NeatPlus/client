import {geoMercator, geoPath} from 'd3';
import {useCallback, useEffect, useState} from 'react';

const countries = [
    {
        countryName: 'Zambia',
        coordinates: [27.8493, -13.1339],
        project: 'Zambia: Mantapala Refugee Settlement',
    },
    {
        countryName: 'Uganda',
        coordinates: [32.2903, 1.3733],
        project: 'Uganda: Bidibidi Refugee Settlement',
    },
    {
        countryName: 'Colombia',
        coordinates: [-74.2973, 4.5709],
        project: 'Colombia: Maicao Transit Center',
    },
    {
        countryName: 'Myanmar',
        coordinates: [95.956, 21.9162],
        project: 'Myanmar: Hpa An Township',
    },
];

const Marks = ({
    data,
    width,
    color,
    countryName,
    zambiaRef,
    ugandaRef,
    myanmarRef,
    colombiaRef,
}) => {
    const [marker, setMarker] = useState('');
    useEffect(() => {
        const setMarkerFromScroll = () => {
            if (zambiaRef.current.offsetTop - window.pageYOffset > -40) {
                setMarker('Zambia');
            } else if (ugandaRef.current.offsetTop - window.pageYOffset > -40) {
                setMarker('Uganda');
            } else if (
                colombiaRef.current.offsetTop - window.pageYOffset >
                -40
            ) {
                setMarker('Colombia');
            } else if (
                myanmarRef.current.offsetTop - window.pageYOffset >
                -40
            ) {
                setMarker('Myanmar');
            }
        };
        window.addEventListener('scroll', setMarkerFromScroll);

        return () => {
            window.removeEventListener('scroll', setMarkerFromScroll);
        };
    }, [zambiaRef, ugandaRef, colombiaRef, myanmarRef]);
    const projection = geoMercator()
        .scale(width / 6.4)
        .translate([width / 2, width / 2]);

    const path = geoPath(projection);
    const scrollToRef = useCallback(
        (ref) => {
            if (ref === myanmarRef) {
                window.scrollTo(0, ref.current.offsetTop - 150);
            } else {
                window.scrollTo(0, ref.current.offsetTop - 120);
            }
        },
        [myanmarRef]
    );

    const handleClick = (name) => {
        if (name === 'Zambia') scrollToRef(zambiaRef);
        if (name === 'Uganda') scrollToRef(ugandaRef);
        if (name === 'Myanmar') scrollToRef(myanmarRef);
        if (name === 'Colombia') scrollToRef(colombiaRef);
    };

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
                {countries.map((country, i) => (
                    <svg
                        key={country.countryName}
                        width='22'
                        height='24'
                        viewBox='0 0 24 24'
                        cursor='pointer'
                        x={projection(country.coordinates)[0] - 11}
                        y={projection(country.coordinates)[1] - 24}
                        onMouseEnter={() => countryName(country.project)}
                        onMouseOut={() => countryName(null)}
                        fill={
                            country.countryName === marker ? '#00a297' : 'gray'
                        }
                        onClick={() => handleClick(country.countryName)}
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

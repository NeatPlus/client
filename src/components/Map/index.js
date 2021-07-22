import {useState, useCallback, useEffect, useMemo} from 'react';
import ReactMapGL, {
    NavigationControl, 
    _useMapControl as useMapControl,
    FlyToInterpolator,
    Marker,
    WebMercatorViewport,
} from 'react-map-gl';
import {FaMapMarkerAlt} from 'react-icons/fa';
import { maxBy, minBy } from 'lodash';

import cs from '@ra/cs';

import MarkerPin from './Marker';
import SurveyMarker from './SurveyMarker';
import Popup from './Popup';
import styles from './styles.scss';

const navControlStyle = {
    right: 10,
    top: 10,
};

const getMinOrMax = (markers, minOrMax, idx) => {
    if (minOrMax === 'max') {
        return (maxBy(markers, value => value.coordinates[idx])).coordinates[idx];
    } else {
        return (minBy(markers, value => value.coordinates[idx])).coordinates[idx];
    }
};

const getBounds = (markers) => {
    const maxLat = getMinOrMax(markers, 'max', 1);
    const minLat = getMinOrMax(markers, 'min', 1);
    const maxLng = getMinOrMax(markers, 'max', 0);
    const minLng = getMinOrMax(markers, 'min', 0);

    const southWest = [minLng, minLat];
    const northEast = [maxLng, maxLat];
    return [southWest, northEast];
};


function Picker(props) {
    const {isActive, setActive} = props;

    const handlePickerClick = useCallback(evt => {
        evt.stopPropagation();
        if (evt.type === 'click') {
            setActive(!isActive);
        }
    }, [isActive, setActive]);

    const {containerRef} = useMapControl({
        onClick: handlePickerClick,
    });

    return (
        <div 
            ref={containerRef}
            className={cs(styles.pickerControl, {
                [styles.pickerControlActive]: isActive,
            })}
        >
            <FaMapMarkerAlt className={styles.pickerIcon} />
        </div>
    );
}


const Map = ({
    showPopup,
    project,
    surveyLocation,
    showPicker, 
    onLocationPick, 
    width, 
    height,
    activeFeature,
    features,
}) => {
    const [viewport, setViewport] = useState({
        width: width || '100%',
        height: height || '100%',
        latitude: 0.0236,
        longitude: 37.9062,
        zoom: 3,
        mapboxApiAccessToken: ''
    });

    const goToActiveFeature = useCallback(() => {
        if(!activeFeature) {
            return;
        }
        const [longitude, latitude] = activeFeature[
            activeFeature.type === 'Point' ? 'coordinates' : 'center'
        ];
        const zoom = 10;
        setViewport({
            ...viewport,
            longitude,
            latitude,
            zoom,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator(),
        });
    }, [viewport, activeFeature]);

    const resetZoom = useCallback(() => {
        setViewport({
            ...viewport,
            zoom: 3,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator(),
        });
    }, [viewport]);

    useEffect(() => {
        if(activeFeature) {
            goToActiveFeature();
        } else {
            resetZoom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFeature]);

    const [isPickerActive, setPickerActive] = useState(null);

    const handleMapClick = useCallback(ptrEvent => {
        if(!isPickerActive) {
            return ptrEvent.stopPropagation();
        }
        setPickerActive(false);
        onLocationPick && onLocationPick(ptrEvent.lngLat);
    }, [isPickerActive, onLocationPick]);

    const surveyFeature = useMemo(() => {
        if(surveyLocation && typeof surveyLocation === 'string') {
            return JSON.parse(surveyLocation);
        }
        if(features?.length === 1) {
            return features[0];
        }
        return surveyLocation;
    }, [surveyLocation, features]);

    useEffect(() => {
        if(surveyFeature) {
            setViewport({
                ...viewport,
                longitude: surveyFeature.coordinates[0],
                latitude: surveyFeature.coordinates[1],
                zoom: 5,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [surveyFeature]);

    useEffect(() => {
        if(features?.length > 1) {
            const MARKERS_BOUNDS = getBounds(features);
            setViewport((viewport) => {
                const NEXT_VIEWPORT = new WebMercatorViewport(viewport)
                    .fitBounds(MARKERS_BOUNDS, {
                        padding: {
                            top: 100,
                            left: 100,
                            right: 100,
                            bottom: 220,
                        }
                    });

                return {
                    ...NEXT_VIEWPORT,
                    transitionDuration: 1000,
                    transitionInterpolator: new FlyToInterpolator(),
                };
            });
        }
    }, [features]);

    return (
        <ReactMapGL
            {...viewport}
            width='100%'
            onViewportChange={setViewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
            mapOptions={{
                logoPosition: showPopup ? 'top-left' : 'bottom-left',
            }}
            onClick={handleMapClick}
        >
            <NavigationControl style={navControlStyle} showCompass={false} />
            {showPopup && <Popup project={project} className={styles.popup} />}
            {showPicker && (
                <Picker 
                    isActive={isPickerActive} 
                    setActive={setPickerActive} 
                />
            )}
            {activeFeature?.type === 'Point' && (
                <Marker 
                    latitude={activeFeature.coordinates[1]} 
                    longitude={activeFeature?.coordinates[0]}
                >
                    <MarkerPin />
                </Marker>
            )}
            {(activeFeature?.type !== 'Point' && activeFeature?.center) && (
                <Marker 
                    latitude={activeFeature.center[1]} 
                    longitude={activeFeature.center[0]} 
                >
                    <MarkerPin />
                </Marker>
            )}
            {!!surveyFeature && (
                <Marker 
                    latitude={surveyFeature.coordinates[1]}
                    longitude={surveyFeature.coordinates[0]}
                >
                    <SurveyMarker />
                </Marker>
            )}
            {features?.length > 1 && features.map((feature, idx) => (
                <Marker 
                    key={idx} 
                    latitude={feature.coordinates[1]}
                    longitude={feature.coordinates[0]}
                >
                    <SurveyMarker />
                </Marker>
            ))}
        </ReactMapGL>
    );
};

export default Map;

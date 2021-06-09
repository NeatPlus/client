import {useState, useCallback, useEffect} from 'react';
import ReactMapGL, {
    NavigationControl, 
    _useMapControl as useMapControl,
    FlyToInterpolator,
    Marker,
} from 'react-map-gl';
import {FiFilter} from 'react-icons/fi';

import cs from '@ra/cs';

import MarkerPin from './Marker';
import Popup from './Popup';
import styles from './styles.scss';

const navControlStyle = {
    right: 10,
    top: 10,
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
            <FiFilter className={styles.pickerIcon} />
        </div>
    );
}


const Map = ({
    showPopup, 
    showPicker, 
    onLocationPick, 
    width, 
    height,
    activeFeature,
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

    return (
        <ReactMapGL
            {...viewport}
            onViewportChange={setViewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
            mapOptions={{
                logoPosition: showPopup ? 'top-left' : 'bottom-left',
            }}
            onClick={handleMapClick}
        >
            <NavigationControl style={navControlStyle} showCompass={false} />
            {showPopup && <Popup className={styles.popup} />}
            {showPicker && (
                <Picker 
                    isActive={isPickerActive} 
                    setActive={setPickerActive} 
                />
            )}
            {activeFeature?.type === 'Point' && (
                <Marker latitude={activeFeature.coordinates[1]} longitude={activeFeature?.coordinates[0]}>
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
        </ReactMapGL>
    );
};

export default Map;

import { useState } from 'react';
import ReactMapGL, {NavigationControl} from 'react-map-gl';

import Popup from './Popup';
import styles from './styles.scss';

const navControlStyle = {
    right: 10,
    top: 10,
};

const Map = () => {
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: 0.0236,
        longitude: 37.9062,
        zoom: 4,
        mapboxApiAccessToken: ''
    });

    return (
        <ReactMapGL
            {...viewport}
            onViewportChange={setViewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
            mapOptions={{
                logoPosition: 'top-left',
            }}
        >
            <NavigationControl style={navControlStyle} showCompass={false} />
            <Popup className={styles.popup} />
        </ReactMapGL>
    );
};

export default Map;

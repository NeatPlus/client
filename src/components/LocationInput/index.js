import {useState, useCallback} from 'react';
import {IoIosSearch} from 'react-icons/io';

import Map from 'components/Map';
import Label from '@ra/components/Form/Label';
import NumberInput from '@ra/components/Form/NumberInput';
import TextInput from '@ra/components/Form/TextInput';
import List from '@ra/components/List';

import useRequest from 'hooks/useRequest';

import cs from '@ra/cs';
import {debounce} from '@ra/utils';

import styles from './styles.scss';

const SearchResultItem = ({item, onSelect}) => {
    const handleClick = useCallback(() => {
        onSelect && onSelect(item);
    }, [item, onSelect]);

    return (
        <div className={styles.resultItem} onClick={handleClick}>
            {item.place_name}
        </div>
    );

};

const LocationInput = props => {
    const {placeholder} = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFeature, setActiveFeature] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [location, setLocation] = useState({
        longitude: '',
        latitude: '',
    });

    const [{loading, data: searchResults}, getLocations] = useRequest(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${process.env.REACT_APP_MAPBOX_API_TOKEN}`, 
    );

    const hideResultsDialog = useCallback(() => {
        setShowResults(false);
        document.removeEventListener('click', hideResultsDialog);
    }, []);

    const showResultsDialog = useCallback(() => {
        setShowResults(true);
        document.addEventListener('click', hideResultsDialog);
    }, [hideResultsDialog]);

    const getLocationsGeojson = debounce(getLocations, 500);

    const handleSearchChange = useCallback(({value}) => {
        if (activeFeature) {
            setActiveFeature(null);
        }
        setSearchQuery(value);
        if(value.length>3) {
            showResultsDialog();
            return getLocationsGeojson();
        }
        setShowResults(false);
    }, [getLocationsGeojson, activeFeature, showResultsDialog]);

    const handleInputChange = useCallback(({name, value}) => {
        setLocation({
            ...location,
            [name]: value,
        });
    }, [location]);

    const handleClear = useCallback(() => {
        setActiveFeature(null);
        setLocation({longitude: '', latitude: ''});
        setSearchQuery('');
    }, []);

    const handleLocationPick = useCallback(lngLat => {
        const [lng, lat] = lngLat;
        setLocation({longitude: lng.toFixed(5), latitude: lat.toFixed(5)});
        setActiveFeature({
            type: 'feature',
            center: lngLat,
            id: `pick-${lng}${lat}`
        });
    }, []);

    const handleLocationSelect = useCallback(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        setActiveFeature(feature);
        setLocation({longitude: lng.toFixed(5), latitude: lat.toFixed(5)});
        setShowResults(false);
    }, []);

    const renderOptions = useCallback(listProps => {
        return (
            <SearchResultItem 
                onSelect={handleLocationSelect} 
                {...listProps} 
            />
        );
    }, [handleLocationSelect]);

    return (
        <div className={styles.container}>
            <div className={styles.inputs}>
                <div className={styles.inputGroup}>
                    <Label className={styles.label}>Latitude (x.y °)</Label>
                    <NumberInput
                        name="latitude"
                        value={location.latitude}
                        placeholder={placeholder} 
                        className={styles.input} 
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.label}>Longitude (x.y °)</Label>
                    <NumberInput
                        name="longitude"
                        value={location.longitude}
                        placeholder={placeholder} 
                        className={styles.input}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.clear} onClick={handleClear}>Clear All</div>
            </div>
            <div className={styles.mapContainer}>
                <div className={styles.searchContainer}>
                    <TextInput 
                        value={activeFeature?.place_name || searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search places" 
                        className={styles.searchInput} 
                    />
                    <IoIosSearch size={20} className={styles.searchIcon} />
                    <List
                        className={cs(styles.searchResults, {
                            [styles.searchResultsNone]: !showResults,
                        })}
                        data={searchResults?.features?.slice(0, 5)}
                        keyExtractor={item => item.id}
                        renderItem={renderOptions}
                        loading={loading}
                    />
                </div>
                <div className={styles.map}>
                    <Map 
                        activeFeature={activeFeature}
                        width={window.screen.width>=767 ? '30vw' : '75vw'} 
                        height="30vh" 
                        showPicker 
                        onLocationPick={handleLocationPick} 
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationInput;

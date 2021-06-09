import {useState, useCallback, useMemo} from 'react';
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

const getPointField = ({longitude, latitude}) => {
    return `{"type": "Point", "coordinates": [${longitude || 0},${latitude || 0}]}`;
};

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
    const {placeholder, onChange, answer} = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isFocused, setFocused] = useState(false);

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const activePoint = useMemo(() => {
        if(!answer || isFocused) {
            return null;
        }
        return JSON.parse(answer);
    }, [answer, isFocused]);

    const location = useMemo(() => {
        if(!answer) {
            return null;
        }
        const point = JSON.parse(answer);
        const [lng, lat] = point?.coordinates;
        return ({
            longitude: lng,
            latitude: lat,
        });
    }, [answer]);

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
        setSearchQuery(value);
        if(value.length>3) {
            showResultsDialog();
            return getLocationsGeojson();
        }
        setShowResults(false);
    }, [getLocationsGeojson, showResultsDialog]);

    const handleInputChange = useCallback(({name, value: inpValue}) => {
        if(name==='longitude') {
            const pointValue = getPointField({
                longitude: inpValue,
                latitude: location?.latitude || 0,
            });
            return onChange && onChange({value: pointValue});
        }
        if(inpValue <= -90 || inpValue >= 90) {
            return;
        }
        const pointValue = getPointField({
            longitude: location?.longitude || 0,
            latitude: inpValue,
        });
        onChange && onChange({value: pointValue});
    }, [location, onChange]);

    const handleClear = useCallback(() => {
        onChange && onChange({value: ''});
        setSearchQuery('');
    }, [onChange]);

    const handleLocationPick = useCallback(lngLat => {
        const [lng, lat] = lngLat;
        const pointValue = getPointField({
            longitude: lng.toFixed(5),
            latitude: lat.toFixed(5),
        });
        onChange && onChange({value: pointValue});
    }, [onChange]);

    const handleLocationSelect = useCallback(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const pointValue = getPointField({
            longitude: lng.toFixed(5),
            latitude: lat.toFixed(5),
        });
        setSearchQuery(feature.place_name);
        onChange && onChange({value: pointValue});
        setShowResults(false);
    }, [onChange]);

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
                        value={location?.latitude || ''}
                        placeholder={placeholder} 
                        className={styles.input} 
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        info="Value must be between -90 and 90"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Label className={styles.label}>Longitude (x.y °)</Label>
                    <NumberInput
                        name="longitude"
                        value={location?.longitude || ''}
                        placeholder={placeholder} 
                        className={styles.input}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
                <div className={styles.clear} onClick={handleClear}>Clear All</div>
            </div>
            <div className={styles.mapContainer}>
                <div className={styles.searchContainer}>
                    <TextInput 
                        value={searchQuery}
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
                        activeFeature={activePoint}
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

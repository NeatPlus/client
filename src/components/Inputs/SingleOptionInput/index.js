import {useCallback} from 'react';

import List from '@ra/components/List';

import Option from '../Option';

const keyExtractor = item => item.id;

const SingleOptionInput = ({checkedOptions, options, onChange}) => {
    const handleCheckedOption = useCallback(option => {
        onChange && onChange({value: [option.id]});
    }, [onChange]);

    const renderOption = useCallback(listProps => {
        const {item: option, ...otherProps} = listProps;

        return (
            <Option 
                option={option} 
                checked={checkedOptions?.some(opt => opt===option.id)} 
                setChecked={handleCheckedOption} 
                {...otherProps} 
            />
        );
    }, [checkedOptions, handleCheckedOption]);

    return (
        <List 
            data={options}
            keyExtractor={keyExtractor}
            renderItem={renderOption}
        />
    );
};

export default SingleOptionInput;

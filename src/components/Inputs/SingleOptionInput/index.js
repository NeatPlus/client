import {useCallback, useState} from 'react';

import List from '@ra/components/List';

import Option from '../Option';

const keyExtractor = item => item.id;

const SingleOptionInput = ({options}) => {
    const [checkedOption, setCheckedOption] = useState(null);

    const renderOption = useCallback(listProps => {
        const {item: option, ...otherProps} = listProps;
        return (
            <Option 
                option={option} 
                checked={checkedOption===option} 
                setChecked={setCheckedOption} 
                {...otherProps} 
            />
        );
    }, [checkedOption]);

    return (
        <List 
            data={options}
            keyExtractor={keyExtractor}
            renderItem={renderOption}
        />
    );
};

export default SingleOptionInput;

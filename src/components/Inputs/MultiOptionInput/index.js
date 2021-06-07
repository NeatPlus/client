import {useCallback, useState} from 'react';

import List from '@ra/components/List';

import Option from '../Option';

const keyExtractor = item => item.id;

const MultiOptionInput = ({options}) => {
    const [checkedOptions, setCheckedOptions] = useState([]);

    const handleCheckedOptions = useCallback(option => {
        const optionIndex = checkedOptions.findIndex(opt => opt.id === option.id);
        if(optionIndex!==-1) {
            const newCheckedOptions = checkedOptions;
            newCheckedOptions.splice(optionIndex, 1);
            return setCheckedOptions([...newCheckedOptions]);
        }
        setCheckedOptions([...checkedOptions, option]);
    }, [checkedOptions]);

    const renderOption = useCallback(listProps => {
        const {item: option, ...otherProps} = listProps;

        return (
            <Option
                multiple
                option={option}
                checked={checkedOptions.some(opt => opt.id===option.id)} 
                setChecked={handleCheckedOptions}
                {...otherProps} 
            />
        );
    }, [checkedOptions, handleCheckedOptions]);

    return (
        <List 
            data={options}
            keyExtractor={keyExtractor}
            renderItem={renderOption}
        />
    );
};

export default MultiOptionInput;

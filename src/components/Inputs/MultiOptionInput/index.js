import {useCallback} from 'react';

import List from '@ra/components/List';

import Option from '../Option';

const keyExtractor = item => item.id;

const MultiOptionInput = ({checkedOptions, options, onChange}) => {
    const handleCheckedOptions = useCallback(option => {
        const optionIndex = checkedOptions?.findIndex(opt => opt === option.id);
        if(checkedOptions && optionIndex!==-1) {
            const newCheckedOptions = checkedOptions;
            newCheckedOptions.splice(optionIndex, 1);
            return onChange && onChange({value: [...newCheckedOptions]});
        }
        if(!checkedOptions) {
            return onChange && onChange({value: [option.id]});
        }
        onChange && onChange({value: [...checkedOptions, option.id]});
    }, [checkedOptions, onChange]);

    const renderOption = useCallback(listProps => {
        const {item: option, ...otherProps} = listProps;

        return (
            <Option
                multiple
                option={option}
                checked={checkedOptions?.some(opt => opt===option.id)} 
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

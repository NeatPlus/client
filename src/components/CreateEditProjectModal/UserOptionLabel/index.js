import React, {useCallback} from 'react';
import SelectInput from '@ra/components/Form/SelectInput';

import {IoMdCloseCircle} from 'react-icons/io';

import styles from './styles.scss';

const keyExtractor = (item) => item.id;
const valueExtractor = (item) => item.title;

const options = [
    {
        id: 'read_only',
        title: 'View'
    },
    {
        id: 'write',
        title: 'Edit'
    },
];

const stringToHslColor = (str, s=40, l=40) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    let h = hash % 360;
    return 'hsl('+h+', '+s+'%, '+l+'%)';
};

export const UserIcon = ({
    item,
    editable,
    onRemove,
}) => {
    const initials = `${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`.toUpperCase();

    const backgroundColor = stringToHslColor(`${item.id}${item.firstName}${item.lastName}`);

    const onCloseClick = (event) => {
        event.stopPropagation();
        onRemove({item});
    };

    return (
        <div
            className={styles.userIcon}
            style={{backgroundColor}}
            title={item.value}
        >
            {initials}
            {editable && 
            <IoMdCloseCircle
                className={styles.closeIcon}
                onClick={onCloseClick} 
            />}
        </div>
    );
};

const UserOptionLabel = ({item, selected, onStateChange}) => {
    const handleChange = useCallback(({option}) => {
        onStateChange({item: {...item, mode: option.id}}); 
    }, [item, onStateChange]);

    const value = options.find(o => o.id === item.mode) || options[0];

    return (
        <div className={styles.optionLabel}>
            <div className={styles.userInfo}>
                <UserIcon item={item} />
                <div className={styles.name}>{item.firstName} {item.lastName}</div>
            </div>
            {selected &&
                    <SelectInput
                        className={styles.select}
                        controlClassName={styles.selectControl}
                        searchable={false}
                        clearable={false}
                        defaultValue={value}
                        keyExtractor={keyExtractor}
                        valueExtractor={valueExtractor}
                        onChange={handleChange}
                        options={options}
                    />
            }
        </div>
    );
};

export default UserOptionLabel;

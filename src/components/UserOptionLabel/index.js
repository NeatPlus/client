import React, {useCallback, useState, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';

import Options from '@ra/components/Form/SelectInput/Options';

import {IoMdCloseCircle} from 'react-icons/io';
import {FiChevronDown} from 'react-icons/fi';

import cs from '@ra/cs';

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
    className,
}) => {
    const {user} = useSelector(state => state.auth);

    const initials = `${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`.toUpperCase();

    const backgroundColor = stringToHslColor(`${item.id}${item.firstName}${item.lastName}`);

    const onCloseClick = (event) => {
        event.stopPropagation();
        onRemove({item});
    };

    return (
        <div
            className={cs(styles.userIcon, className)}
            style={{backgroundColor}}
            title={item.value}
        >
            {initials}
            {editable && user.username !== item.username && 
            <IoMdCloseCircle
                className={styles.closeIcon}
                onClick={onCloseClick} 
            />}
        </div>
    );
};

const UserOptionLabel = ({item, selected, onStateChange, userOptions}) => {
    const handleChange = useCallback(({item: option}) => {
        onStateChange({item: {...item, mode: option.id}}); 
    }, [item, onStateChange]);

    const [expanded, setExpanded] = useState(false);
    const handleToggleSelect = useCallback((event) => {
        event.stopPropagation();
        setExpanded(e => !e);
    }, []);

    const valueOptions = userOptions ?? options;

    let value = valueOptions.find(o => o.id === item.mode);
    if (selected && !value) {
        value = valueOptions[0];
        onStateChange({item: {...item, mode: value.id}});
    }

    const selectRef = useRef(null);
    const handleOutsideClick = useCallback(event => {
        if(!selectRef?.current?.contains(event.target)) {
            setExpanded(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [handleOutsideClick]);

    return (
        <div className={styles.optionLabel}>
            <div className={styles.userInfo}>
                <UserIcon item={item} />
                <div className={styles.name}>{item.firstName} {item.lastName}</div>
            </div>
            <div ref={selectRef} className={styles.select}>
                {selected && (
                    <div className={styles.selectControl} onClick={handleToggleSelect}>
                        <div className={styles.selectValue}>
                            {value?.title}
                        </div>
                        <div className={styles.selectIndicator}>
                            <FiChevronDown
                                size={16}
                                onClick={handleToggleSelect}
                            />
                        </div>
                    </div>
                )}
                {expanded && (
                    <div className={styles.selectOptionsWrapper}>
                        <Options
                            className={styles.selectOptions}
                            data={valueOptions}
                            keyExtractor={keyExtractor}
                            valueExtractor={valueExtractor}
                            selectedItem={value}
                            onItemClick={handleChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOptionLabel;

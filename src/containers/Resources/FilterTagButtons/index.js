import {useCallback, useMemo} from 'react';
import {BiCheck} from 'react-icons/bi';

import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';

import styles from './styles.scss';

const idExtractor = item => item.id;

const TagButton = ({item, onToggle, activeTagIds}) => {
    const isActive = useMemo(() => activeTagIds.includes(item.id), [activeTagIds, item]);

    const handleToggle = useCallback(() => {
        onToggle(item.id);
    }, [onToggle, item]);
    
    return (
        <button
            className={cs(styles.tagButton, {
                [styles.tagButtonClicked]: isActive
            })}
            value={item.id}
            onClick={handleToggle}
        >
            {isActive && <BiCheck size={20} />}
            {item.title}
        </button>

    );
};

const FilterTagButtons = ({
    activeTagIds,
    onToggle,
    onClear,
    filterTags,
    filtersActive
}) => {
    const renderTagButton = useCallback(listProps => (
        <TagButton {...listProps} onToggle={onToggle} activeTagIds={activeTagIds} />
    ), [onToggle, activeTagIds]);

    return (
        <div
            className={cs(styles.container, {
                [styles.containerShow]: filtersActive,
                [styles.containerHide]: !filtersActive
            })}
        >
            <List
                className={cs(styles.tagButtons, {
                    [styles.tagButtonShow]: filtersActive,
                    [styles.tagButtonHide]: !filtersActive
                })}
                data={filterTags}
                renderItem={renderTagButton}
                keyExtractor={idExtractor}
            />
            {activeTagIds.length > 0 && (
                <button
                    className={styles.clearButton}
                    onClick={onClear}
                >
                    <Localize>Clear all</Localize>
                </button>
            )}
        </div>
    );
};

export default FilterTagButtons;

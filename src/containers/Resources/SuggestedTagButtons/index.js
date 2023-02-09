import {useCallback} from 'react';

import List from '@ra/components/List';

import styles from './styles.scss';

const idExtractor = item => item.id;

const TagButton = ({item, onToggle, activeTagIds}) => {
    const handleToggle = useCallback(() => {
        onToggle(item.id);
    }, [item, onToggle]);

    return (
        <button
            className={styles.suggestedTagButton}
            value={item.id}
            onClick={handleToggle}
        >
            {item.title}
        </button>
    );
};

const SuggestedTagButtons = ({suggestedTags, onChange, loading}) => {
    const renderTagButton = useCallback(listProps => (
        <TagButton {...listProps} onToggle={onChange} />
    ), [onChange]);

    return (
        <List
            loading={loading}
            className={styles.suggestedTags}
            data={suggestedTags}
            renderItem={renderTagButton}
            keyExtractor={idExtractor}
        />
    );
};

export default SuggestedTagButtons;

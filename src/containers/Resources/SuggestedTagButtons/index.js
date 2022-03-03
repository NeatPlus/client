import {useEffect, useState} from 'react';

import {_} from 'services/i18n';

import styles from './styles.scss';

const SuggestedTagButtons = ({handleSuggestedTags}) => {
    const [suggestedTags, setSuggestedTags] = useState([]);

    useEffect(() => {
        setSuggestedTags([
            {tag: 1, text: _('How-to')},
            {tag: 4, text: _('U-NEAT')},
            {tag: 3, text: _('R-NEAT')},
            {tag: 5, text: _('French')},
            {tag: 9, text: _('Video')},
        ]);
    }, []);
    return (
        <div className={styles.suggestedTags}>
            {suggestedTags.map((data) => (
                <button
                    key={data.tag}
                    className={styles.suggestedTagButton}
                    value={data.tag}
                    onClick={(e) => handleSuggestedTags(e.target.value)}
                >
                    {data.text}
                </button>
            ))}
        </div>
    );
};

export default SuggestedTagButtons;

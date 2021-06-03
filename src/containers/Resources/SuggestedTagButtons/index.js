import {useEffect, useState} from 'react';
import styles from './styles.scss';

const SuggestedTagButtons = ({handleSuggestedTags}) => {
    const [suggestedTags, setSuggestedTags] = useState([]);

    useEffect(() => {
        setSuggestedTags([
            {tag: 1, text: 'How-to'},
            {tag: 4, text: 'U-NEAT'},
            {tag: 3, text: 'R-NEAT'},
            {tag: 5, text: 'French'},
            {tag: 9, text: 'Video'},
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

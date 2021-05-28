import {useEffect, useState} from 'react';
import styles from './styles.scss';

const SuggestedTagButtons = ({handleSuggestedTags}) => {
    const [suggestedTags, setSuggestedTags] = useState([]);

    useEffect(() => {
        setSuggestedTags([
            {tag: 'how_to', text: 'How-to'},
            {tag: 'u_neat', text: 'U-NEAT'},
            {tag: 'r_neat', text: 'R-NEAT'},
            {tag: 'french', text: 'French'},
            {tag: 'video', text: 'Video'},
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

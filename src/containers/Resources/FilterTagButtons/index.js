import {useEffect, useState} from 'react';
import {BiCheck} from 'react-icons/bi';

import styles from './styles.scss';

const FilterTagButtons = ({
    clickedTags,
    handleToggleClickedTag,
    handleClearAll,
    filtersClicked,
}) => {
    const [filterTags, setFilterTags] = useState([]);

    useEffect(() => {
        setFilterTags([
            {tag: 'how_to', text: 'How-to'},
            {tag: 'methodology', text: 'Methodology'},
            {tag: 'r_neat', text: 'R-NEAT+'},
            {tag: 'u_neat', text: 'U-NEAT+'},
            {tag: 'french', text: 'French'},
            {tag: 'spanish', text: 'Spanish'},
            {tag: 'english', text: 'English'},
            {tag: 'communication', text: 'Communication'},
            {tag: 'video', text: 'Video'},
        ]);
    }, []);
    return (
        <div
            className={`${styles.container} ${
                filtersClicked ? styles.containerShow : styles.containerHide
            }`}
        >
            <div
                className={`${styles.tagButtons} ${
                    filtersClicked ? styles.tagButtonShow : styles.tagButtonHide
                }`}
            >
                {filterTags.map((data) => (
                    <button
                        key={data.tag}
                        className={`${styles.tagButton} ${
                            clickedTags.includes(data.tag) &&
                            styles.tagButtonClicked
                        }`}
                        value={data.tag}
                        onClick={(e) => handleToggleClickedTag(e.target.value)}
                    >
                        {clickedTags.includes(data.tag) && (
                            <BiCheck size={20} />
                        )}
                        {data.text}
                    </button>
                ))}
            </div>
            <button
                className={`${styles.clearButton} ${
                    !clickedTags.length && styles.clearButtonHide
                }`}
                onClick={handleClearAll}
            >
                Clear all
            </button>
        </div>
    );
};

export default FilterTagButtons;

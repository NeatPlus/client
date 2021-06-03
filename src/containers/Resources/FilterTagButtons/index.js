import {BiCheck} from 'react-icons/bi';

import styles from './styles.scss';

const FilterTagButtons = ({
    clickedTags,
    handleToggleClickedTag,
    handleClearAll,
    filtersClicked,
    filterTags,
}) => {
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
                        key={data.id}
                        className={`${styles.tagButton} ${
                            clickedTags.includes(data.id) &&
                            styles.tagButtonClicked
                        }`}
                        value={data.id}
                        onClick={(e) => handleToggleClickedTag(e.target.value)}
                    >
                        {clickedTags.includes(data.id) && <BiCheck size={20} />}
                        {data.title}
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

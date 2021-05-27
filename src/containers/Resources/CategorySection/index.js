import {useCallback, useEffect, useState} from 'react';

import {BiSearch} from 'react-icons/bi';
import {FiFilter} from 'react-icons/fi';
import {RiArrowDownSLine} from 'react-icons/ri';

import resources from '../../../services/mockData/resources.json';

import FilterTagButtons from '../FilterTagButtons';
import SuggestedTagButtons from '../SuggestedTagButtons';
import CategoryCard from '../CategoryCard';
import Button from 'components/Button';
import Input from '@ra/components/Form/Input';

import styles from './styles.scss';

const CategorySection = () => {
    const [filtersClicked, setFiltersClicked] = useState(false);
    const [clickedTags, setClickedTags] = useState([]);
    const [allResources, setAllResources] = useState([]);
    const [allResourcesSlice, setAllResourcesSlice] = useState(6);
    const [requiredData, setRequiredData] = useState([]);
    const [requiredDataSlice, setRequiredDataSlice] = useState(6);
    const [inputData, setInputData] = useState({
        searchInput: '',
    });

    useEffect(() => {
        setAllResources(resources);
    }, []);

    const handleToggleFiltersClicked = useCallback(() => {
        setFiltersClicked(!filtersClicked);
    }, [filtersClicked]);

    const handleToggleClickedTag = useCallback(
        (value) => {
            const index = clickedTags.indexOf(value);
            if (index < 0) {
                setClickedTags([...clickedTags, value]);
                if (value === 'video') {
                    if (!clickedTags.length) {
                        const newVideoArr = allResources.filter(
                            (obj) => obj.video_link !== ''
                        );
                        setRequiredData([...newVideoArr]);
                    } else {
                        const newVideoArr = allResources.filter((obj1) =>
                            requiredData.every(
                                (obj2) =>
                                    obj1.id !== obj2.id &&
                                    obj1.video_link !== ''
                            )
                        );
                        setRequiredData([...newVideoArr, ...requiredData]);
                    }
                } else {
                    if (clickedTags.includes('video')) {
                        const newArr = allResources.filter((obj1) =>
                            requiredData.every(
                                (obj2) =>
                                    obj1.id !== obj2.id && obj1.tag === value
                            )
                        );
                        setRequiredData([...newArr, ...requiredData]);
                    } else {
                        const newArray = allResources.filter(
                            (data) => data.tag === value
                        );
                        setRequiredData([...newArray, ...requiredData]);
                    }
                }
            }
            if (index > -1) {
                clickedTags.splice(index, 1);
                setClickedTags([...clickedTags]);
                if (value === 'video') {
                    const newArr = requiredData.filter((obj1) =>
                        clickedTags.includes(obj1.tag)
                    );
                    setRequiredData([...newArr]);
                } else {
                    const newArr = requiredData.filter(
                        (data) => data.tag !== value
                    );
                    setRequiredData([...newArr]);
                }

                if (requiredDataSlice > 6) {
                    setRequiredDataSlice(requiredDataSlice - 6);
                }
            }
            setAllResourcesSlice(6);
        },
        [clickedTags, allResources, requiredData, requiredDataSlice]
    );

    const handleClearAll = useCallback(() => {
        setClickedTags([]);
        setRequiredData([]);
        setRequiredDataSlice(6);
    }, []);

    const handleSuggestedTags = useCallback(
        (value) => {
            setFiltersClicked(true);
            handleToggleClickedTag(value);
        },
        [handleToggleClickedTag]
    );

    const loadMore = useCallback(() => {
        setAllResourcesSlice(allResourcesSlice + 6);
    }, [allResourcesSlice]);

    const loadMore2 = useCallback(() => {
        setRequiredDataSlice(requiredDataSlice + 6);
    }, [requiredDataSlice]);

    const handleChange = useCallback(
        ({name, value}) =>
            setInputData({
                ...inputData,
                [name]: value,
            }),
        [inputData]
    );

    return (
        <div className={styles.containerCategorySection}>
            <div className={styles.inputContainer1}>
                <div className={styles.inputContainer2}>
                    <BiSearch size={25} className={styles.searchIcon} />
                    <Input
                        type='search'
                        name='searchInput'
                        onChange={handleChange}
                        className={styles.input}
                        placeholder='Search resources'
                    />
                </div>
            </div>
            <div className={styles.suggested}>
                <h2 className={styles.suggestedTitle}>
                    Suggested Categories/Tags :
                </h2>
                <SuggestedTagButtons
                    handleSuggestedTags={handleSuggestedTags}
                />
                <div className={styles.allResources}>
                    <h2>
                        {requiredData.length === 0
                            ? `All Resources (${allResources.length})`
                            : `Showing Results (${requiredData.length})`}
                    </h2>
                    <div className={styles.filterSort}>
                        <button className={styles.filters}>
                            Sort by <RiArrowDownSLine size={20} />
                        </button>
                        <button
                            className={`${styles.filters} ${
                                filtersClicked && styles.filtersClicked
                            }`}
                            onClick={handleToggleFiltersClicked}
                        >
                            <FiFilter size={20} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>
            <FilterTagButtons
                clickedTags={clickedTags}
                handleToggleClickedTag={handleToggleClickedTag}
                handleClearAll={handleClearAll} filtersClicked={filtersClicked}
            />
            <div className={styles.cards}>
                {!requiredData.length
                    ? allResources
                        .slice(0, allResourcesSlice)
                        .map((data) => (
                            <CategoryCard
                                key={data.id}
                                title={data.title}
                                description={data.summary}
                                embedId={data.video_link}
                                pdf={data.pdf_link}
                            />
                        ))
                    : requiredData
                        .slice(0, requiredDataSlice)
                        .map((data) => (
                            <CategoryCard
                                key={data.id}
                                title={data.title}
                                description={data.summary}
                                embedId={data.video_link}
                                pdf={data.pdf_link}
                            />
                        ))}
            </div>
            <div className={styles.loadMore}>
                <Button
                    className={`${
                        allResources.length !== allResourcesSlice &&
                        !requiredData.length
                            ? styles.loadMoreButton
                            : styles.loadMoreButtonHide
                    }`}
                    onClick={loadMore}
                >
                    Load More
                </Button>
                <Button
                    className={`${
                        requiredData.length <= requiredDataSlice
                            ? styles.loadMoreButtonHide
                            : styles.loadMoreButton
                    }`}
                    onClick={loadMore2}
                >
                    Load More
                </Button>
            </div>
        </div>
    );
};

export default CategorySection;

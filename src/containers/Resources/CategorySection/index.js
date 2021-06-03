import {useCallback, useEffect, useState} from 'react';

import {BiSearch} from 'react-icons/bi';
import {FiFilter} from 'react-icons/fi';
import {RiArrowDownSLine} from 'react-icons/ri';

import Api from 'services/api';
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
    const [allTags, setAllTags] = useState([]);
    const [inputData, setInputData] = useState({
        searchInput: '',
    });
    const [searchedData, setSearchedData] = useState([]);
    const [tagsData, setTagsData] = useState([]);

    useEffect(() => {
        async function fetchAllResources() {
            const {results} = await Api.get('/resource/');
            setAllResources([...results]);
        }
        async function fetchAllResourcesTag() {
            const {results} = await Api.get('/resource-tag/');
            setAllTags([...results]);
        }
        fetchAllResources();
        fetchAllResourcesTag();
    }, []);

    const handleToggleFiltersClicked = useCallback(() => {
        setFiltersClicked(!filtersClicked);
    }, [filtersClicked]);

    const handleToggleClickedTag = useCallback(
        (val) => {
            const value = parseInt(val);
            const index = clickedTags.indexOf(value);
            if (index < 0) {
                setClickedTags([...clickedTags, value]);
                const filteredArr = allResources.filter(
                    (obj1) =>
                        tagsData.every((obj2) => obj1.id !== obj2.id) &&
                        obj1.tags.includes(value)
                );
                const mergeData = [
                    ...new Set([...filteredArr, ...tagsData, ...searchedData]),
                ];
                setRequiredData([...mergeData]);
                setTagsData([...filteredArr, ...tagsData]);
            }
            if (index > -1) {
                clickedTags.splice(index, 1);
                setClickedTags([...clickedTags]);
                const filteredArr = tagsData.filter((data) =>
                    clickedTags.some((tag) => data.tags.includes(tag))
                );
                const mergeData = [
                    ...new Set([...filteredArr, ...searchedData]),
                ];
                setRequiredData([...mergeData]);
                setTagsData([...filteredArr]);

                if (requiredDataSlice > 6) {
                    setRequiredDataSlice(requiredDataSlice - 6);
                }
            }
            setAllResourcesSlice(6);
        },
        [clickedTags, allResources, requiredDataSlice, tagsData, searchedData]
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
        ({name, value}) => {
            setInputData({
                ...inputData,
                [name]: value,
            });
            if (value === '') {
                setSearchedData([]);
                setRequiredData([...tagsData]);
            }
            if (value !== '') {
                const filteredData = allResources.filter((data) =>
                    Object.values(data)
                        .join('')
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
                const mergeData = [...new Set([...filteredData, ...tagsData])];
                setRequiredData([...mergeData]);
                setSearchedData([...filteredData]);
            }
        },
        [inputData, allResources, tagsData]
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
                        {!inputData.searchInput && requiredData.length === 0
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
                handleClearAll={handleClearAll}
                filtersClicked={filtersClicked}
                filterTags={allTags}
            />
            <div className={styles.cards}>
                {!allResources.length ? (
                    <p className={styles.fallbackText}>
                        There are not any resources currently.
                    </p>
                ) : !requiredData.length ? (
                    allResources
                        .slice(0, allResourcesSlice)
                        .map((data) => (
                            <CategoryCard
                                key={data.id}
                                title={data.title}
                                description={data.description}
                                videoUrl={data.videoUrl}
                                attachment={data.attachment}
                            />
                        ))
                ) : (
                    requiredData
                        .slice(0, requiredDataSlice)
                        .map((data) => (
                            <CategoryCard
                                key={data.id}
                                title={
                                    clickedTags.includes(5) && data.titleFr
                                        ? data.titleFr
                                        : clickedTags.includes(6) &&
                                          data.titleEs
                                            ? data.titleEs
                                            : data.title
                                }
                                description={
                                    clickedTags.includes(5) &&
                                    data.descriptionFr
                                        ? data.descriptionFr
                                        : clickedTags.includes(6) &&
                                          data.descriptionEs
                                            ? data.descriptionEs
                                            : data.description
                                }
                                videoUrl={data.videoUrl}
                                attachment={data.attachment}
                            />
                        ))
                )}
            </div>
            <div className={styles.loadMore}>
                <Button
                    className={`${
                        allResources.length >= allResourcesSlice &&
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

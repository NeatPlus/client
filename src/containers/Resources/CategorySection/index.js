import {useCallback, useEffect, useState, useMemo} from 'react';
import {BiSearch} from 'react-icons/bi';
import {FiFilter} from 'react-icons/fi';

import Button from 'components/Button';
import Container from 'components/Container';
import Input from '@ra/components/Form/Input';
import List from '@ra/components/List';
import {NeatLoader} from 'components/Loader';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import Api from 'services/api';
import usePromise from '@ra/hooks/usePromise';
import {debounce} from '@ra/utils';

import FilterTagButtons from '../FilterTagButtons';
import SuggestedTagButtons from '../SuggestedTagButtons';
import CategoryCard from '../CategoryCard';

import styles from './styles.scss';

const idExtractor = item => item.id;

const CategorySection = () => {
    const [{loading, result: resourceResult}, getResources] = usePromise(Api.getResources);
    
    const [{result: tagsData}, getResourceTags] = usePromise(Api.getResourceTags);
    const tags = useMemo(() => tagsData?.results || [], [tagsData]);
    const suggestedTags = useMemo(() => {
        return tags.filter(tag => {
            return ['How To', 'U-NEAT+', 'R-NEAT+', 'French', 'Video'].includes(tag.title);
        });
    }, [tags]);

    const [loadMoreCount, setLoadMoreCount] = useState(0);
    const handleLoadMore = useCallback(() => setLoadMoreCount(lmc => lmc + 1), []);

    const [searchQuery, setSearchQuery] = useState('');
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeSearchQuery = useCallback(debounce(({value}) => {
        setLoadMoreCount(0);
        setSearchQuery(value);
    }, 750), []);

    const [filtersActive, setFiltersActive] = useState(false);
    const toggleFilters = useCallback(() => setFiltersActive(fa => !fa), []);

    const [activeTagIds, setActiveTagIds] = useState([]);
    const toggleActiveTag = useCallback((tag) => {
        setLoadMoreCount(0);
        setFiltersActive(true);
        if(activeTagIds.includes(tag)) {
            return setActiveTagIds(activeTagIds.filter(tagId => tagId !== tag));
        }
        return setActiveTagIds([...activeTagIds, tag]);
    }, [activeTagIds]);

    const handleClearActiveTags = useCallback(() => {
        setLoadMoreCount(0);
        setActiveTagIds([]);
    }, []);

    const [resources, setResources] = useState([]);

    const loadResources = useCallback(async () => {
        try {
            const resourceData = await getResources({
                limit: 6,
                offset: loadMoreCount * 6,
                search: searchQuery,
                tags__in: activeTagIds.join(',')
            });
            if (resourceData?.results) {
                if(loadMoreCount === 0) {
                    return setResources(resourceData.results);
                }
                setResources(r => ([...r, ...resourceData.results]));
            }
        } catch(error) {
            console.log(error);
        }
    }, [getResources, loadMoreCount, searchQuery, activeTagIds]);

    useEffect(() => {
        getResourceTags({limit: -1});
    }, [getResourceTags]);

    useEffect(() => {
        loadResources();
    }, [loadResources]);

    return (
        <div className={styles.containerCategorySection}>
            <Container>
                <div className={styles.inputContainer1}>
                    <div className={styles.inputContainer2}>
                        <BiSearch size={25} className={styles.searchIcon} />
                        <Input
                            type="search"
                            name="searchInput"
                            onChange={handleChangeSearchQuery}
                            className={styles.input}
                            placeholder={_('Search resources')}
                        />
                    </div>
                </div>
                <div className={styles.content}>
                    <h2 className={styles.suggestedTitle}>
                        <Localize>Suggested Categories/Tags</Localize>
                    </h2>
                    <SuggestedTagButtons
                        suggestedTags={suggestedTags}
                        onChange={toggleActiveTag}
                        activeTagIds={activeTagIds}
                    />
                    <div className={styles.resourcesControls}>
                        <h2 className={styles.resourcesTitle}>
                            {activeTagIds.length > 0 || searchQuery ? (
                                <Localize>Showing Results</Localize>
                            ) : (
                                <Localize>All Resources</Localize>
                            )}
                            {!loading && ` (${resourceResult?.count || 0})`}
                        </h2>
                        <div className={styles.filterSort}>
                            <Button secondary outline className={cs(styles.filters, {[styles.filtersActive]: filtersActive})} onClick={toggleFilters}>
                                <FiFilter size={20} />
                                <Localize>Filters</Localize>
                            </Button>
                        </div>
                    </div>
                </div>
                <FilterTagButtons
                    activeTagIds={activeTagIds}
                    onToggle={toggleActiveTag}
                    onClear={handleClearActiveTags}
                    filterTags={tags}
                    filtersActive={filtersActive}
                />
                <List
                    loading={!resources.length && loading}
                    className={styles.cards}
                    data={resources}
                    renderItem={CategoryCard}
                    keyExtractor={idExtractor}
                    EmptyComponent={<p className={styles.fallbackText}>
                        <Localize>No resources found!</Localize>
                    </p>}
                    LoadingComponent={<NeatLoader />}
                />
                {resourceResult?.count > (loadMoreCount + 1) * 6 && (
                    <div className={styles.loadMore}>
                        <Button className={styles.loadMoreButton} onClick={handleLoadMore}>
                            <Localize>Load More</Localize>
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default CategorySection;

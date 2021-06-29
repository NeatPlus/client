import {useMemo} from 'react';
import {useSelector} from 'react-redux';

const useFilterItems = (data, type) => {
    const {removedItems, filters} = useSelector(state => state.dashboard);

    return useMemo(() => {
        const filteredEdits = data?.filter(el => {
            return removedItems && !removedItems?.some(item =>
                type === item.type && el[item.accessor] === item.identifier);
        });
        if(type==='statement' && filters?.length) {
            return filteredEdits?.filter(st => st?.tags && !st.tags.some(tag => {
                return tag && !filters.some(el => el === tag);
            }));
        }
        return filteredEdits;
    }, [removedItems, data, type, filters]);
};

export default useFilterItems;

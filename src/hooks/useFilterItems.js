import {useMemo} from 'react';
import {useSelector} from 'react-redux';

const useFilterItems = (data, type, module) => {
    const {removedItems, filters} = useSelector(state => state.dashboard);

    return useMemo(() => {
        const filteredEdits = data?.filter(el => {
            return removedItems && !removedItems?.some(item => {
                if(module === 'sens') {
                    return (item.module === 'sens' || !item.module) && type === item.type && el[item.accessor] === item.identifier;
                }
                return module===item.module && type === item.type && el[item.accessor] === item.identifier;
            });
        });
        if(type==='statement' && filters?.length) {
            return filteredEdits?.filter(st => st?.tags && st.tags.some(tag => {
                return tag && filters.some(el => el === tag);
            }));
        }
        return filteredEdits;
    }, [removedItems, data, type, filters, module]);
};

export default useFilterItems;

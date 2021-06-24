import {useMemo} from 'react';
import {useSelector} from 'react-redux';

const useFilterRemovedItems = (data, type) => {
    const {removedItems} = useSelector(state => state.dashboard);

    return useMemo(() => data?.filter(el => {
        return removedItems && !removedItems?.some(item => 
            type === item.type && el[item.accessor] === item.identifier);
    }), [removedItems, data, type]);
};

export default useFilterRemovedItems;

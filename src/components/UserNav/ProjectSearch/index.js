import {useCallback} from 'react';
import {BiSearch} from 'react-icons/bi';

import Input from '@ra/components/Form/Input';

import {debounce} from '@ra/utils';

import styles from './styles.scss';

const ProjectSearch = ({query, onChange}) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeCallback = useCallback(debounce(onChange, 1000), [onChange]);
    
    const handleChange = useCallback(
        ({value}) => {
            changeCallback(value);  
        },
        [changeCallback]
    );

    return (
        <div className={styles.inputContainer}>
            <BiSearch size={22} className={styles.searchIcon} />
            <Input
                type='search'
                name='searchInput'
                defaultValue={query}
                onChange={handleChange}
                className={styles.input}
                placeholder='Search projects'
            />
        </div>
    );
};

export default ProjectSearch;

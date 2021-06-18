import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {BiSearch} from 'react-icons/bi';
import Input from '@ra/components/Form/Input';
import {getFormattedProjects} from 'store/selectors/project';
import styles from './styles.scss';

const Search = ({setSearchedProject, setSearchedText}) => {
    const projects = useSelector(getFormattedProjects);

    const [inputData, setInputData] = useState({
        searchInput: [],
    });
    const handleChange = useCallback(
        ({name, value}) => {
            setInputData({
                ...inputData,
                [name]: value,
            });
            if (value === '') {
                setSearchedText('');
                setSearchedProject([]);
            }
            if (value !== '') {
                setSearchedText(value);
                const filteredData = projects.filter((data) =>
                    data.title.toLowerCase().includes(value.toLowerCase())
                );
                setSearchedProject([...filteredData]);
            }
        },
        [inputData, setSearchedProject, projects, setSearchedText]
    );
    return (
        <div className={styles.inputContainer}>
            <BiSearch size={22} className={styles.searchIcon} />
            <Input
                type='search'
                name='searchInput'
                onChange={handleChange}
                className={styles.input}
                placeholder='Search projects'
            />
        </div>
    );
};

export default Search;

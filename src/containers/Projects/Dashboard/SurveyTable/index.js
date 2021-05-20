import {useCallback} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {BsPlus, BsArrowRight} from 'react-icons/bs';

import Button from 'components/Button';
import OptionsDropdown from 'components/OptionsDropdown';
import Table from '@ra/components/Table';

import surveyData from 'services/mockData/surveys.json';

import styles from './styles.scss';

const surveyColumns = [
    {
        Header: 'Name',
        accessor: 'name',
    }, 
    {
        Header: 'Created on',
        accessor: 'created_on',
    },
    {
        Header: 'Options',
        accessor: '',
    },
];

const HeaderItem = ({column}) => {
    if(column.Header==='Options') {
        return '';
    }
    return column.Header;
};

export const DataItem = ({item, column}) => {
    const handleEditClick = useCallback(() => {
        //TODO: Edit Survey Functionality
    }, []);

    const handleDeleteClick = useCallback(() => {
        // TODO: Delete Survey Functionality
    }, []);

    if(column.Header==='Name') {
        return <Link to={`surveys/${item.id}`} className={styles.nameItem}>{item[column.accessor]}</Link>;
    }
    if(column.Header==='Options') {
        return (
            <OptionsDropdown onEdit={handleEditClick} onDelete={handleDeleteClick} />
        );
    }
    return item[column.accessor];
};

const SurveyTable = ({onTakeSurveyClick}) => {
    const history = useHistory();

    const handleSurveysClick = useCallback(() => history.push('surveys/'), [history]);

    return (
        <div className={styles.surveys}>
            <div className={styles.surveyHeader}>
                <h3 className={styles.surveyTitle}>Surveys</h3>
                <Button outline onClick={onTakeSurveyClick} className={styles.button}>
                    <BsPlus size={20} className={styles.buttonIcon} /> Take Survey
                </Button>
            </div>
            <p className={styles.subTitle}>{surveyData.length} surveys</p>
            <div className={styles.surveyTable}>
                <Table 
                    className={styles.table} 
                    data={surveyData} 
                    columns={surveyColumns} 
                    maxRows={10}
                    renderHeaderItem={HeaderItem}
                    renderDataItem={DataItem}
                    headerClassName={styles.tableHeader}
                    headerRowClassName={styles.headerRow}
                    bodyClassName={styles.tableBody}
                    bodyRowClassName={styles.bodyRow}
                /> 
            </div>
            <Button className={styles.buttonBottom} secondary outline onClick={handleSurveysClick}>
                More Details <BsArrowRight size={20} className={styles.buttonBottomIcon} />
            </Button>
        </div> 
    );
};

export default SurveyTable;

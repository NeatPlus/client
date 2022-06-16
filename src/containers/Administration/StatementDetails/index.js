import {useMemo, useState, useCallback} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {
    BiRightArrowAlt,
    BiCheckbox,
    BiCheckboxChecked,
    BiCheckboxSquare,
    BiChevronLeft,
} from 'react-icons/bi';
import {BsChevronRight} from 'react-icons/bs';

import Button from 'components/Button';
import {Localize} from '@ra/components/I18n';
import Table from '@ra/components/Table';
import {NeatLoader} from 'components/Loader';

import cs from '@ra/cs';
import {_} from 'services/i18n';

import styles from './styles.scss';

const SelectIcon = ({selected, intermediate, onClick}) => {
    if(selected) {
        return (
            <BiCheckboxChecked
                className={cs(styles.selectIcon, {[styles.selectIconSelected]: selected})}
                onClick={onClick}
            />
        );
    }
    if(intermediate) {
        return (
            <BiCheckboxSquare
                className={cs(styles.selectIcon, {[styles.selectIconSelected]: selected || intermediate})}
                onClick={onClick}
            />
        );
    } 
    return (
        <BiCheckbox
            className={cs(styles.selectIcon, {[styles.selectIconSelected]: selected})}
            onClick={onClick}
        />
    ); 
};

const HeaderItem =  ({column, selectedQuestions, moduleQuestions, onClick}) => {
    if(column.Header === _('Select')) {
        return (
            <SelectIcon
                selected={selectedQuestions?.length && selectedQuestions?.length === moduleQuestions?.length}
                intermediate={selectedQuestions?.length > 0}
                onClick={onClick}
            />
        );
    }
    return column.Header;
}; 

const DataItem = ({item, column, selectedQuestions}) => {
    if(column.Header===_('Questions')) {
        return (
            <div className={styles.nameItem}>
                {item?.[column.accessor] ?? '-'}
            </div>
        );
    }
    if(column.Header===_('Select')) {
        return <SelectIcon selected={selectedQuestions?.some(ques => ques.id === item.id)} />;
    }
    return item?.[column.accessor] ?? '-';
}; 

const StatementDetails = props => {
    const {activeContext, activeModule} = props;

    const columns = useMemo(() => ([
        {
            Header: _('Select'),
            accessor: '',
        }, {
            Header: _('Categories'),
            accessor: 'groupTitle',
        },  {
            Header: _('Questions'),
            accessor: 'title',
        }
    ]), []);

    const history = useHistory();
    const {statementId} = useParams();

    const {questionGroups, questions, status} = useSelector(state => state.question);

    const {statements} = useSelector(state => state.statement);
    const activeStatement = useMemo(() => {
        return statements.find(st => st.id === +statementId);
    }, [statementId, statements]);

    const moduleQuestions = useMemo(() => {
        return questions[activeModule?.code]?.map(ques => ({
            ...ques,
            groupTitle: questionGroups?.find(grp => grp.id === ques.group)?.title || '',
        })) || [];
    }, [questions, activeModule, questionGroups]);

    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const handleSelectAllToggle = useCallback(() => {
        if(selectedQuestions?.length === moduleQuestions?.length) {
            return setSelectedQuestions([]);
        }
        setSelectedQuestions(moduleQuestions);
    }, [selectedQuestions, moduleQuestions]);

    const handleRowClick = useCallback(item => {
        if(!item) {
            return;
        }
        const newSelectedQuestions = [...selectedQuestions];
        const questionIdx = selectedQuestions?.findIndex(ques => ques.id === item.id);
        if(questionIdx > -1) {
            newSelectedQuestions.splice(questionIdx, 1);
            return setSelectedQuestions(newSelectedQuestions);
        }
        return setSelectedQuestions([...selectedQuestions, item]); 
    }, [selectedQuestions]);

    const handleNextClick = useCallback(() => {
        history.push(`/administration/statements/${statementId}/weightage/`, {selectedQuestions});
    }, [statementId, selectedQuestions, history]);

    const renderHeaderItem = useCallback(tableProps => {
        return (
            <HeaderItem
                {...tableProps}
                selectedQuestions={selectedQuestions}
                moduleQuestions={moduleQuestions}
                onClick={handleSelectAllToggle}
            />
        );
    }, [selectedQuestions, moduleQuestions, handleSelectAllToggle]);

    const renderDataItem = useCallback(tableProps => {
        return (
            <DataItem {...tableProps} selectedQuestions={selectedQuestions} />
        );
    }, [selectedQuestions]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    <Link 
                        to="/administration/statements/" 
                        className={styles.backLink}
                    >
                        <BiChevronLeft 
                            size={22} 
                            className={styles.backIcon} 
                        />
                    </Link>
                    <div className={styles.titleContainer}>
                        <div className={styles.tagsContainer}>
                            <div className={styles.tag}>
                                {activeContext?.title}
                            </div>
                            <BsChevronRight className={styles.levelIcon} />
                            <div className={styles.tag}>
                                {activeModule?.title}
                            </div>
                        </div>
                        <h2 className={styles.statementTitle}>
                            {activeStatement?.title}
                        </h2>
                    </div>
                    <Button className={styles.headerButton} onClick={handleNextClick} disabled={selectedQuestions?.length===0}>
                        <Localize>Next</Localize>
                        <BiRightArrowAlt size={24} className={styles.buttonIcon} />
                    </Button>
                </div>
                <div className={styles.contentBody}>
                    <section className={styles.selectSection}>
                        <div className={styles.infoContainer}>
                            <p className={styles.infoText}>
                                <Localize>
                                    Select all relevant questions related to the above statement
                                </Localize>
                            </p>
                            <p className={styles.infoSelected}>
                                {selectedQuestions?.length} <Localize>item(s) selected.</Localize>
                            </p>
                        </div>
                        <div className={styles.tableContainer}>
                            <Table 
                                loading={status!=='complete'}
                                LoadingComponent={<NeatLoader medium />}
                                EmptyComponent={<p className={styles.statusMessage}>
                                    <Localize>No questions found! Please wait...</Localize>
                                </p>}
                                className={styles.table} 
                                data={moduleQuestions} 
                                columns={columns} 
                                maxRows={moduleQuestions?.length}
                                renderDataItem={renderDataItem}
                                renderHeaderItem={renderHeaderItem}
                                headerClassName={styles.tableHeader}
                                headerRowClassName={styles.headerRow}
                                bodyClassName={styles.tableBody}
                                bodyRowClassName={styles.bodyRow}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    </section>
                    <section className={styles.insightsSection}>
                        <h4 className={styles.insightTitle}>
                            <Localize>
                                Insights on correlation of categories
                            </Localize>
                        </h4>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StatementDetails;

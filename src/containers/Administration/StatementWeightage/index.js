import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {useLocation, useParams, useHistory, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {BiChevronLeft, BiPlusCircle} from 'react-icons/bi';
import {BsChevronRight} from 'react-icons/bs';

import Button from 'components/Button';
import Tabs, {Tab} from 'components/Tabs';
import ToggleSwitch from '@ra/components/Form/ToggleSwitch';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';

import Api from 'services/api';
import {_} from 'services/i18n';
import Toast from 'services/toast';
import {setChangedOptions, setChangedQuestions} from 'store/actions/admin';

import QuestionsTable from './QuestionsTable';
import OptionsTable from './OptionsTable';
import InsightsTable from './InsightsTable';
import styles from './styles.scss';

const StatementWeightage = props => {
    const {activeModule, activeContext} = props;

    const history = useHistory();
    const location = useLocation();
    const {statementId} = useParams();

    const dispatch = useDispatch();

    const [{loading}, uploadWeightages] = usePromise(Api.uploadWeightages);

    const {statements} = useSelector(state => state.statement);
    const activeStatement = useMemo(() => {
        return statements.find(st => st.id === +statementId);
    }, [statementId, statements]);

    const {options} = useSelector(state => state.question);
    const {status, questionStatements, optionStatements} = useSelector(state => state.weightage);

    const selectedQuestions = useMemo(() => {
        return location?.state?.selectedQuestions?.map(ques => {
            return {
                ...ques,
                weightage: questionStatements.find(quesSt => quesSt.question === ques.id && quesSt.statement === +statementId)?.weightage,
            };
        }) || [];
    }, [location, questionStatements, statementId]);

    useEffect(() => {
        if(!selectedQuestions?.length > 0) {
            history.push(`/administration/statements/${statementId}/`);
        }
        dispatch(setChangedOptions([]));
        dispatch(setChangedQuestions([]));
    }, [dispatch, history, selectedQuestions, statementId]);

    const [activeTab, setActiveTab] = useState('current');

    const [activeQuestion, setActiveQuestion] = useState(selectedQuestions[0]);
    const activeOptions = useMemo(() => {
        return options.filter(opt => opt.question === activeQuestion?.id)?.map(opt => {
            return {
                ...opt,
                weightage: optionStatements.find(optSt => optSt.option === opt.id && optSt.statement === +statementId)?.weightage,
            };
        });
    }, [options, activeQuestion, optionStatements, statementId]);

    const handleTabChange = useCallback(payload => {
        setActiveTab(payload.activeTab);
    }, []);

    const handleQuestionClick = useCallback(question => {
        setActiveQuestion(question);
    }, []);

    const [showFunctionInput, setShowFunctionInput] = useState(false);
    const handleFunctionToggle = useCallback(({value}) => {
        setShowFunctionInput(value);
    }, []);

    const {changedQuestions, changedOptions} = useSelector(state => state.admin); 
    const handleSaveClick = useCallback(async () => {
        try {
            await uploadWeightages(statementId, {
                version: 'initial',
                questions: changedQuestions,
                options: changedOptions,
            });
            Toast.show(_('Weightages have been successfully updated!'), Toast.SUCCESS);
        } catch(error) {
            Toast.show(getErrorMessage(error) ?? _('An error occured'), Toast.DANGER);
            console.log(error);
        }
    }, [changedQuestions, changedOptions, uploadWeightages, statementId]);

    
    const renderHeaderControls = useCallback(() => {
        return (
            <div className={styles.addButton}>
                <BiPlusCircle className={styles.addIcon} />
                <Localize>Add variant</Localize>
            </div>
        );
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    <Link 
                        to={`/administration/statements/${statementId}/`} 
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
                    <Button
                        className={styles.headerButton}
                        onClick={handleSaveClick}
                        loading={loading}
                        disabled={selectedQuestions?.length===0}
                    >
                        <Localize>Save</Localize>
                    </Button>
                </div> 
                <div className={styles.contentBody}>
                    <div className={styles.weightageSection}>
                        <Tabs 
                            activeTab={activeTab}
                            primary
                            className={styles.tabs}
                            PostHeaderComponent={renderHeaderControls}
                            headerContainerClassName={styles.headerContainer}
                            headerClassName={styles.tabsHeader}
                            tabItemClassName={styles.headerItem}
                            contentContainerClassName={styles.tabContent}
                            onChange={handleTabChange}

                        >
                            <Tab label="current" title={_('Current')}>
                                <div className={styles.tablesContainer}>
                                    <QuestionsTable
                                        selectedQuestions={selectedQuestions}
                                        handleQuestionClick={handleQuestionClick}
                                        activeQuestion={activeQuestion}
                                        setActiveQuestion={setActiveQuestion} 
                                    />
                                    <OptionsTable activeOptions={activeOptions} loading={status==='loading'} />
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    <div className={styles.bottomSection}>
                        <div className={styles.bottomGroup}>
                            <div className={cs(styles.functionGroup, {[styles.functionGroupActive]: showFunctionInput})}>
                                <div className={styles.functionGroupInfo}>
                                    <h5 className={styles.functionGroupTitle}>
                                        <Localize>Enter your function</Localize>
                                    </h5>
                                    {!showFunctionInput && (
                                        <p className={styles.functionGroupText}>
                                            <Localize>Write your custom function to manage weightage</Localize>
                                        </p>
                                    )}
                                </div>
                                <ToggleSwitch size={48} onChange={handleFunctionToggle} />
                            </div>
                            {showFunctionInput ? (
                                <div className={styles.functionInputContainer}>
                                    <textarea className={styles.functionInput} />
                                </div>
                            ) : (
                                <div className={styles.insightsGroup}>
                                    <h5 className={styles.insightsGroupTitle}>
                                        <Localize>Insights</Localize>
                                    </h5>
                                    <InsightsTable />
                                </div>
                            )}
                        </div>
                        {showFunctionInput && (
                            <div className={styles.bottomGroup}>
                                <h5 className={styles.bottomGroupTitle}>
                                    <Localize>Insights</Localize>
                                </h5>
                                <InsightsTable />
                            </div>
                        )}
                        <div className={styles.bottomGroup}>
                            <h5 className={styles.bottomGroupTitle}>
                                <Localize>User feedbacks</Localize>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementWeightage;

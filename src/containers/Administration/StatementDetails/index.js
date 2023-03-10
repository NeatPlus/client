import { useMemo, useState, useCallback, useEffect } from 'react';
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    BiRightArrowAlt,
    BiCheckbox,
    BiCheckboxChecked,
    BiCheckboxSquare,
    BiChevronLeft,
} from 'react-icons/bi';
import { BsChevronRight } from 'react-icons/bs';

import Button from 'components/Button';
import { Localize } from '@ra/components/I18n';
import Table from '@ra/components/Table';
import { NeatLoader } from 'components/Loader';
import ConfirmationModal from 'components/ConfirmationModal';

import cs from '@ra/cs';
import { _ } from 'services/i18n';
import Api from 'services/api';
import Toast from 'services/toast';
import { getErrorMessage } from '@ra/utils/error';
import usePromise from '@ra/hooks/usePromise';

import styles from './styles.scss';

const SelectIcon = ({ selected, intermediate, onClick }) => {
    if (selected) {
        return (
            <BiCheckboxChecked
                className={cs(styles.selectIcon, {
                    [styles.selectIconSelected]: selected,
                })}
                onClick={onClick}
            />
        );
    }
    if (intermediate) {
        return (
            <BiCheckboxSquare
                className={cs(styles.selectIcon, {
                    [styles.selectIconSelected]: selected || intermediate,
                })}
                onClick={onClick}
            />
        );
    }
    return (
        <BiCheckbox
            className={cs(styles.selectIcon, {
                [styles.selectIconSelected]: selected,
            })}
            onClick={onClick}
        />
    );
};

const HeaderItem = ({
    column,
    selectedQuestions,
    moduleQuestions,
    onClick,
}) => {
    if (column.Header === _('Select')) {
        return (
            <SelectIcon
                selected={
                    selectedQuestions?.length &&
                    selectedQuestions?.length === moduleQuestions?.length
                }
                intermediate={selectedQuestions?.length > 0}
                onClick={onClick}
            />
        );
    }
    return column.Header;
};

const DataItem = ({ item, column, selectedQuestions }) => {
    if (column.Header === _('Questions')) {
        return (
            <div className={styles.nameItem}>
                {item?.[column.accessor] ?? '-'}
            </div>
        );
    }
    if (column.Header === _('Select')) {
        return (
            <SelectIcon
                selected={selectedQuestions?.some(
                    (ques) => ques.id === item.id
                )}
            />
        );
    }
    return item?.[column.accessor] ?? '-';
};

const StatementDetails = (props) => {
    const {activeContext, activeModule} = useOutletContext();

    const columns = useMemo(
        () => [
            {
                Header: _('Select'),
                accessor: '',
            },
            {
                Header: _('Categories'),
                accessor: 'groupTitle',
            },
            {
                Header: _('Questions'),
                accessor: 'title',
            },
        ],
        []
    );

    const navigate = useNavigate();
    const { statementId } = useParams();

    const [showConfirmPublish, setShowConfirmPublish] = useState(false);

    const handleShowPublish = useCallback(
        () => setShowConfirmPublish(true),
        []
    );
    const handleCancelPublish = useCallback(
        () => setShowConfirmPublish(false),
        []
    );

    const { questionGroups, questions, status } = useSelector(
        (state) => state.question
    );

    const { statements } = useSelector((state) => state.statement);
    const activeStatement = useMemo(() => {
        return statements.find((st) => st.id === +statementId);
    }, [statementId, statements]);

    const [{ result, loading: loadingWeightages }, loadQuestionStatement] = usePromise(
        Api.getQuestionStatements
    );
    const [{ loading: publishing }, publishDraft] = usePromise(
        Api.activateDraftWeightages
    );

    useEffect(() => {
        if (activeStatement) {
            loadQuestionStatement({
                statement: activeStatement?.id,
                version: 'latest',
                limit: -1,
                question__group__module: activeModule?.id,
            });
        }
    }, [loadQuestionStatement, activeStatement, activeModule]);

    const hasChanges = useMemo(() => result?.results?.some(qStatement => qStatement.version === 'draft'), [result]);

    const moduleQuestions = useMemo(() => {
        return (
            questions[activeModule?.code]?.map((ques) => ({
                ...ques,
                groupTitle:
                    questionGroups?.find((grp) => grp.id === ques.group)
                        ?.title || '',
            })) || []
        );
    }, [questions, activeModule, questionGroups]);

    const initialSelectedQuestions = useMemo(() => {
        return moduleQuestions.filter(
            (mq) =>
                result?.results.some((qs) => {
                    return qs.question === mq.id;
                })
        );
    }, [moduleQuestions, result]);

    const [selectedQuestions, setSelectedQuestions] = useState(
        initialSelectedQuestions
    );

    useEffect(() => {
        if (result?.results) {
            setSelectedQuestions(initialSelectedQuestions);
        }
    }, [result, initialSelectedQuestions]);

    const handleSelectAllToggle = useCallback(() => {
        if (selectedQuestions?.length === moduleQuestions?.length) {
            return setSelectedQuestions([]);
        }
        setSelectedQuestions(moduleQuestions);
    }, [selectedQuestions, moduleQuestions]);

    const handleRowClick = useCallback(
        (item) => {
            if (!item) {
                return;
            }
            const newSelectedQuestions = [...selectedQuestions];
            const questionIdx = selectedQuestions?.findIndex(
                (ques) => ques.id === item.id
            );
            if (questionIdx > -1) {
                newSelectedQuestions.splice(questionIdx, 1);
                return setSelectedQuestions(newSelectedQuestions);
            }
            return setSelectedQuestions([...selectedQuestions, item]);
        },
        [selectedQuestions]
    );

    const handleNextClick = useCallback(() => {
        navigate(`/administration/statements/${statementId}/weightage/`, {
            state: {selectedQuestions},
        });
    }, [statementId, selectedQuestions, navigate]);

    const handleConfirmPublish = useCallback(async () => {
        if (!activeStatement?.id) {
            return Toast.show(
                _('Please wait until the statement changes are loaded'),
                Toast.DANGER
            );
        }
        try {
            await publishDraft(activeStatement.id, {
                module: activeModule?.id
            });
            await loadQuestionStatement({
                statement: activeStatement.id,
                question__group__module: activeModule?.id,
                version: 'latest',
                limit: -1
            });
            Toast.show(
                _('Your changes have been successfully published!'),
                Toast.SUCCESS
            );
        } catch (error) {
            Toast.show(
                getErrorMessage(error) ||
                    _('An error occured while publishing your changes!'),
                Toast.DANGER
            );
        }
        setShowConfirmPublish(false);
    }, [activeStatement, publishDraft, loadQuestionStatement, activeModule]);

    const renderHeaderItem = useCallback(
        (tableProps) => {
            return (
                <HeaderItem
                    {...tableProps}
                    selectedQuestions={selectedQuestions}
                    moduleQuestions={moduleQuestions}
                    onClick={handleSelectAllToggle}
                />
            );
        },
        [selectedQuestions, moduleQuestions, handleSelectAllToggle]
    );

    const renderDataItem = useCallback(
        (tableProps) => {
            return (
                <DataItem
                    {...tableProps}
                    selectedQuestions={selectedQuestions}
                />
            );
        },
        [selectedQuestions]
    );

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    <Link
                        to="/administration/statements/"
                        className={styles.backLink}
                    >
                        <BiChevronLeft size={22} className={styles.backIcon} />
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
                    {hasChanges && (
                        <Button
                            className={styles.headerButton}
                            onClick={handleShowPublish}
                        >
                            <Localize>Publish</Localize>
                        </Button>
                    )}
                </div>
                <div className={styles.contentBody}>
                    <section className={styles.selectSection}>
                        <div className={styles.infoContainer}>
                            <p className={styles.infoText}>
                                <Localize>
                                    Select all relevant questions related to the above statement
                                </Localize>
                            </p>
                            <div className={styles.infoRight}>
                                <p className={styles.infoSelected}>
                                    <Localize
                                        text="1 item selected."
                                        textPlural="{{ count }} items selected."
                                        count={selectedQuestions?.length || 0}
                                    />
                                </p>
                                <Button
                                    onClick={handleNextClick}
                                    className={styles.nextButton}
                                    loading={loadingWeightages}
                                    disabled={selectedQuestions?.length === 0}
                                >
                                    <Localize>Next</Localize>
                                    <BiRightArrowAlt
                                        size={22}
                                        className={styles.nextButtonIcon}
                                    />
                                </Button>
                            </div>
                        </div>
                        <div className={styles.tableContainer}>
                            <Table
                                loading={status !== 'complete'}
                                LoadingComponent={<NeatLoader medium />}
                                EmptyComponent={
                                    <p className={styles.statusMessage}>
                                        <Localize>
                                            No questions found! Please wait...
                                        </Localize>
                                    </p>
                                }
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
            <ConfirmationModal
                isVisible={showConfirmPublish}
                onClose={handleCancelPublish}
                onConfirm={handleConfirmPublish}
                confirmButtonText={_('Publish')}
                titleText={_('Publish changes?')}
                confirmButtonProps={{ loading: publishing }}
                DescriptionComponent={
                    <>
                        <p className={styles.modalText}>
                            <Localize>
                                If you publish the changes, all further calculations will use the new configuration.
                            </Localize>
                        </p>
                        <p className={styles.modalText}>
                            <Localize>
                                Are you sure you want to publish your changes?
                            </Localize>
                        </p>
                    </>
                }
            />
        </div>
    );
};

export default StatementDetails;

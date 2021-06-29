import {useState, useCallback, useMemo} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {BiChevronLeft, BiEditAlt} from 'react-icons/bi';
import {BsArrowCounterclockwise} from 'react-icons/bs';
import {FiFilter} from 'react-icons/fi';
import {MdClose} from 'react-icons/md';

import Tabs, {Tab} from 'components/Tabs';
import Button from 'components/Button';
import RestoreItemsModal from 'components/RestoreItemsModal';
import List from '@ra/components/List';
import CheckboxInput from '@ra/components/Form/CheckboxInput';

import cs from '@ra/cs';
import useInitActiveProject from 'hooks/useInitActiveProject';
import useInitActiveSurvey from 'hooks/useInitActiveSurvey';
import {setEditMode, applyRemoveItems, setFilters} from 'store/actions/dashboard';

import Overview from './Overview';
import Module from './Module';

import styles from './styles.scss';

const keyExtractor = item => item.id;

const IssuesBox = ({showIssues, onClose}) => {
    const dispatch = useDispatch();

    const {
        statementTagGroups, 
        statementTags
    } = useSelector(state => state.statement);
    const {filters} = useSelector(state => state.dashboard);

    const [selectedIssues, setSelectedIssues] = useState(filters);

    const handleChangeIssue = useCallback(({checked, id}) => {
        const issueId = +id?.split('-')?.[1];
        if(checked && issueId) {
            setSelectedIssues([...selectedIssues, issueId]);
        } else {
            setSelectedIssues(selectedIssues.filter(el => el !== issueId));
        }
    }, [selectedIssues]);
    
    const handleApplyFilter = useCallback(() => {
        dispatch(setFilters(selectedIssues));
        onClose && onClose();
    }, [dispatch, selectedIssues, onClose]);

    const renderIssueItem = useCallback(({item}) => {
        const issueId = `issue-${item.id}`;

        return (
            <div className={styles.issueItem}>
                <CheckboxInput
                    checked={selectedIssues.some(el => item.id===el)}
                    onChange={handleChangeIssue}
                    size={18}
                    id={issueId} 
                    className={styles.checkbox} 
                />
                <label htmlFor={issueId}>{item.title}</label>
            </div>
        );
    }, [handleChangeIssue, selectedIssues]);

    // TODO: Handle multiple tag groups
    const tagGroup = useMemo(() => statementTagGroups[0], [statementTagGroups]);
    const tags = useMemo(() => 
        statementTags?.filter(el => tagGroup && el.group === tagGroup?.id) || [], 
    [statementTags, tagGroup]);

    const handleToggleAll = useCallback(() => {
        if(selectedIssues.length===tags.length) {
            return setSelectedIssues([]);
        }
        setSelectedIssues(tags.map(el => el.id));
    }, [tags, selectedIssues]);

    if(!showIssues) {
        return null;
    }

    return (
        <div className={styles.issuesContainer}>
            <div className={styles.issuesHeader}>
                <p className={styles.title}>{tagGroup?.title}</p>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <List
                className={styles.issues}
                data={tags}
                keyExtractor={keyExtractor}
                renderItem={renderIssueItem}
            />
            <div className={styles.issuesFooter}>
                <Button className={styles.button} onClick={handleApplyFilter}>
                    Apply
                </Button>
                <div className={styles.allControl} onClick={handleToggleAll}>
                    {selectedIssues.length===tags.length ? 'Clear' : 'Select All'}
                </div>
            </div>
        </div>
    );
};

const SurveyDashboard = () => {
    const dispatch = useDispatch();

    useInitActiveProject();
    useInitActiveSurvey();

    const {
        isEditMode, 
        itemsToRemove,
        filters,
    } = useSelector(state => state.dashboard);

    const activateEditMode = useCallback(() => dispatch(setEditMode(true)), [dispatch]);
    const deactivateEditMode = useCallback(() => dispatch(setEditMode(false)), [dispatch]);

    const [activeTab, setActiveTab] = useState('overview');
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showIssues, setShowIssues] = useState(false);

    const handleTabChange = useCallback(payload => {
        setActiveTab(payload.activeTab);
        deactivateEditMode();
    }, [deactivateEditMode]);

    const {activeProject} = useSelector(state => state.project);

    const toggleRestoreModal = useCallback(() => 
        setShowRestoreModal(!showRestoreModal), 
    [showRestoreModal]);

    const toggleIssues = useCallback(() =>
        setShowIssues(!showIssues),
    [showIssues]);

    const handleSaveClick = useCallback(() => dispatch(applyRemoveItems()), [dispatch]);

    const handleClearFilters = useCallback(() => dispatch(setFilters([])), [dispatch]);


    const renderHeaderControls = useCallback(tabHeaderProps => {
        if(activeTab === 'overview') {
            return null;
        }

        if(isEditMode) {
            return (
                <div className={styles.headerControls}>
                    <Button 
                        className={styles.controlButton} 
                        onClick={toggleRestoreModal}
                    >
                        <BsArrowCounterclockwise size={20} className={styles.controlIcon} />
                        Restore
                    </Button>
                    <Button
                        disabled={!itemsToRemove.length}
                        onClick={handleSaveClick}
                        className={styles.saveButton}
                    >
                        Save
                    </Button>
                </div>
            );
        }

        return (
            <div className={styles.headerControls}>
                <Button className={styles.controlButton} onClick={activateEditMode}>
                    <BiEditAlt size={20} className={styles.controlIcon} />
                    Edit
                </Button>
                <Button 
                    className={cs(styles.controlButton, {
                        [styles.controlButtonActive]: filters?.length
                    })} 
                    onClick={toggleIssues}
                >
                    {filters?.length ? (
                        <div className={styles.filterCount}>
                            {filters.length}
                        </div>
                    ) : (
                        <FiFilter size={18} className={styles.controlIcon} />
                    )}
                    Filters
                </Button>
                <IssuesBox onClose={toggleIssues} showIssues={showIssues} />
                {filters?.length > 0 && (
                    <div className={styles.clearText} onClick={handleClearFilters}>
                        Clear All
                    </div>
                )}
            </div>
        );
    }, [
        activeTab, 
        activateEditMode, 
        toggleRestoreModal, 
        isEditMode, 
        handleSaveClick,
        itemsToRemove,
        showIssues,
        toggleIssues,
        filters,
        handleClearFilters
    ]);

    const renderSpacer = useCallback(() => {
        if (activeTab==='overview') {
            return null;
        }
        return <div className={styles.spacer} />;
    }, [activeTab]);

    return (
        <div className={styles.container}>
            {isEditMode ? (
                <div onClick={deactivateEditMode} className={styles.backLink}>
                    <div className={styles.closeIconContainer}>
                        <MdClose size={18} className={styles.closeIcon} />
                    </div>
                    Close Edit Mode
                </div>
            ) : activeProject ? (
                <Link 
                    to={`/projects/${activeProject.id}/surveys/`} 
                    className={styles.backLink}
                >
                    <BiChevronLeft 
                        size={22} 
                        className={styles.backIcon} 
                    /> Back to Surveys
                </Link>
            ) : null}
            <Tabs 
                defaultActiveTab="overview"
                secondary 
                className={styles.tabs}
                renderPreHeaderComponent={renderSpacer}
                renderPostHeaderComponent={renderHeaderControls}
                headerContainerClassName={styles.headerContainer}
                headerClassName={styles.tabsHeader}
                tabItemClassName={styles.headerItem}
                contentContainerClassName={styles.tabContent}
                onChange={handleTabChange}
            >
                <Tab label="overview" title="Overview">
                    <Overview />
                </Tab>
                <Tab label="sensitivity" title="Sensitivity">
                    <Module type="sensitivity" />
                </Tab>
                <Tab label="shelter" title="Shelter">
                    <Module type="shelter" />
                </Tab>
                <Tab label="wash" title="WASH">
                    <Module type="wash" />
                </Tab>
                <Tab label="fs" title="FS">
                    <Module type="fs" />
                </Tab>
            </Tabs>
            <RestoreItemsModal 
                isVisible={showRestoreModal} 
                onClose={toggleRestoreModal} 
            />
        </div>
    ); 
};

export default SurveyDashboard;

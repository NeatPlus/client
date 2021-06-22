import {useState, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {BiChevronLeft, BiEditAlt} from 'react-icons/bi';
import {BsArrowCounterclockwise} from 'react-icons/bs';
import {FiFilter} from 'react-icons/fi';
import {MdClose} from 'react-icons/md';

import Tabs, {Tab} from 'components/Tabs';
import Button from 'components/Button';
import RestoreItemsModal from 'components/RestoreItemsModal';

import useInitActiveProject from 'hooks/useInitActiveProject';
import useInitActiveSurvey from 'hooks/useInitActiveSurvey';
import {setEditMode, applyRemoveItems} from 'store/actions/dashboard';

import Overview from './Overview';
import Module from './Module';

import styles from './styles.scss';

const SurveyDashboard = () => {
    const dispatch = useDispatch();
    
    useInitActiveProject();
    useInitActiveSurvey();

    const {isEditMode, itemsToRemove} = useSelector(state => state.dashboard);
    const activateEditMode = useCallback(() => dispatch(setEditMode(true)), [dispatch]);
    const deactivateEditMode = useCallback(() => dispatch(setEditMode(false)), [dispatch]);

    const [activeTab, setActiveTab] = useState('overview');
    const [showRestoreModal, setShowRestoreModal] = useState(false);

    const handleTabChange = useCallback(payload => {
        setActiveTab(payload.activeTab);
        deactivateEditMode();
    }, [deactivateEditMode]);
    
    const {activeProject} = useSelector(state => state.project);
    
    const toggleRestoreModal = useCallback(() => 
        setShowRestoreModal(!showRestoreModal), 
    [showRestoreModal]);

    const handleSaveClick = useCallback(() => dispatch(applyRemoveItems()), [dispatch]);

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
                <Button className={styles.controlButton}>
                    <FiFilter size={18} className={styles.controlIcon} />
                    Filters
                </Button>
            </div>
        );
    }, [
        activeTab, 
        activateEditMode, 
        toggleRestoreModal, 
        isEditMode, 
        handleSaveClick,
        itemsToRemove,
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

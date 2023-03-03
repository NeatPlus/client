import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {BsThreeDots} from 'react-icons/bs';
import {BiMessageDots, BiMessageAltAdd} from 'react-icons/bi';

import {Localize} from '@ra/components/I18n';
import Dropdown from '@ra/components/Dropdown';

import styles from './styles.scss';

const ReportOptionsDropdown = ({moduleCode}) => {
    const navigate = useNavigate();

    const {user} = useSelector(state => state.auth);
    const {activeProject} = useSelector(state => state.project);
    const {activeSurvey} = useSelector(state => state.survey);

    const handleFeedbacksClick = useCallback(() => {
        navigate(`/projects/${activeProject?.id}/surveys/${activeSurvey?.id}/feedback/`, {state: {moduleCode}});
    }, [navigate, activeProject, activeSurvey, moduleCode]);

    const handleBaselineFeedbacksClick = useCallback(() => {
        navigate(`/projects/${activeProject.id}/surveys/${activeSurvey?.id}/feedback/`, {state: {
            moduleCode,
            isBaseline: true,
        }});
    }, [navigate, activeProject, activeSurvey, moduleCode]);

    const renderOptionsLabel = useCallback(() => {
        return (
            <BsThreeDots size={22} />
        );
    }, []);

    return (
        <Dropdown
            labelContainerClassName={styles.optionsLabel}
            renderLabel={renderOptionsLabel}
            align='right'
        >
            <div className={styles.dropdownOptions}>
                <div className={styles.optionItem} onClick={handleFeedbacksClick}>
                    <BiMessageDots size={20} className={styles.optionIcon} />
                    <span className={styles.optionText}>
                        <Localize>Feedbacks</Localize>
                    </span>
                </div>
                {user.permissions?.some(per => per === 'summary.add_baseline_feedback') && (
                    <div className={styles.optionItem} onClick={handleBaselineFeedbacksClick}>
                        <BiMessageAltAdd size={32} className={styles.optionIcon} />
                        <span className={styles.optionText}>
                            <Localize>Add Baseline Feedbacks</Localize>
                        </span>
                    </div>
                )}
                {/* TODO: Help action
                                    <div className={styles.optionItem}>
                                        <BsQuestionCircle size={18} className={styles.optionIcon} />
                                        <span className={styles.optionText}>
                                            <Localize>Help</Localize>
                                        </span>
                                    </div>
                                    */}
            </div>
        </Dropdown>

    );
};

export default ReportOptionsDropdown;

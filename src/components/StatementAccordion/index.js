import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {FiAlertTriangle, FiChevronRight, FiAlertCircle} from 'react-icons/fi';

import FeedbackModal from 'components/FeedbackModal';
import InfoTooltip from 'components/InfoTooltip';
import Editable from 'components/Editable';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import {_} from 'services/i18n';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './styles.scss';

const keyExtractor = item => item.id;

const StatementAccordion = ({item, isExpanded, module}) => {
    const [open, setOpen] = useState(isExpanded);
    const [contentHeight, setContentHeight] = useState(isExpanded?'none':'0px');
    
    const content = useRef(null);

    const toggleAccordion = useCallback((type, value) => {
        let shouldOpen = !open;
        if(type==='all') {
            shouldOpen = value;
        }
        if (shouldOpen===open) {
            return;
        }
        setOpen(shouldOpen);
        setContentHeight(
            shouldOpen ? `${content.current.scrollHeight}px` : '0px'
        );
    }, [open]);

    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleShowFeedbackModal = useCallback(() => {
        setShowFeedbackModal(true);
    }, []);
    const handleHideFeedbackModal = useCallback(() => {
        setShowFeedbackModal(false);
    }, []);

    useEffect(() => {
        if(item.severity && isExpanded) {
            toggleAccordion('all', isExpanded);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded, item]);

    const renderListData = useCallback(({item}) =>
        <li className={styles.listItem}>{item.title}</li>,
    []);

    const mitigations = useMemo(() => item.statement?.mitigations || [], [item]);
    const opportunities = useMemo(() => item.statement?.opportunities || [], [item]);

    if(!item.severity) {
        return null;
    }

    return (
        <React.Fragment>
            <div className={styles.accordionContainer}>
                <Editable 
                    module={module}
                    type="statement" 
                    accessor="id" 
                    identifier={item.statement?.id}
                >
                    <div
                        className={cs(
                            styles.accordionSection, 
                            open && styles.accordionSectionActive,
                            styles[`accordionSection${item.severity}`]
                        )}>
                        {open && (
                            <div className={styles.statementControls}>
                                <span
                                    className={cs(
                                        styles.concernSpan, 
                                        styles[`concernSpan${item.severity}`]
                                    )}>
                                    {item.severity} <Localize>concern</Localize>
                                </span>
                                <div className={cs(styles.feedbackControl, 'no-print')}>
                                    <FiAlertTriangle className={styles.feedbackIcon} />
                                    <Localize
                                        text="Conflicting score? {{ link:provide suggestions/feedback }}."
                                        link={<span
                                            className={styles.link}
                                            onClick={handleShowFeedbackModal}
                                        />}
                                    />
                                </div>
                            </div>
                        )}
                        <button
                            type="button"
                            className={styles.accordion}
                            onClick={toggleAccordion}
                        >
                            {item.statement?.isExperimental && (
                                <InfoTooltip
                                    icon={FiAlertCircle}
                                    iconClassName={styles.experimentalIcon}
                                    message={_('This concern level of this statement might vary by context.')}
                                />
                            )}
                            <div className={cs(
                                styles.accordionTitle, 
                                open && styles.activeTitle
                            )}>
                                {item.statement?.title}
                            </div>
                            <div className={styles.rightSection}>
                                {!open && (
                                    <span className={styles.span}>
                                        <Localize>
                                                Mitigations, Opportunities and more
                                        </Localize>
                                    </span>
                                )}
                                <FiChevronRight className={cs(styles.downIcon, open && styles.rotateUp)} />
                            </div>
                        </button>
                        <div
                            ref={content}
                            style={{maxHeight: `${contentHeight}`}}
                            className={styles.accordionContent}>
                            <div className={styles.accordionText}>
                                {item.statement?.hints && (
                                    <h3 className={styles.listTitle}>
                                        <Localize>ADDITIONAL INFORMATION</Localize>
                                    </h3>
                                )}
                                {item.statement?.hints || ''}
                                <h3 className={styles.listTitle}><Localize>MITIGATIONS</Localize></h3>
                                <List
                                    data={mitigations}
                                    component="ul"
                                    keyExtractor={keyExtractor}
                                    renderItem={renderListData}
                                />
                                <h3 className={styles.listTitle}><Localize>OPPORTUNITIES</Localize></h3>
                                <List
                                    data={opportunities}
                                    component="ul"
                                    keyExtractor={keyExtractor}
                                    renderItem={renderListData}
                                />
                            </div>
                        </div>
                    </div>
                </Editable>
            </div>
            <FeedbackModal statementResult={item} isVisible={showFeedbackModal} onClose={handleHideFeedbackModal} />
        </React.Fragment>
    );
};

export default StatementAccordion;

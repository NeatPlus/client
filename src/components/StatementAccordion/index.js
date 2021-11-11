import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {FiAlertTriangle, FiChevronRight} from 'react-icons/fi';

import Editable from 'components/Editable';
import List from '@ra/components/List';

import cs from '@ra/cs';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './styles.scss';

const keyExtractor = item => item.id;

const StatementAccordion = ({item, isExpanded}) => {
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

    useEffect(() => {
        if(item.severity && isExpanded) {
            toggleAccordion('all', isExpanded);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded, item]);

    const renderListData = useCallback(({item}) =>
        <li className={styles.listItem}>{item.title}</li>,
    []);

    const mitigations = useMemo(() => item.statement.mitigations, [item]);
    const opportunities = useMemo(() => item.statement.opportunities, [item]);

    if(!item.severity) {
        return null;
    }

    return (
        <div className={styles.accordionContainer}>
            <Editable 
                type="statement" 
                accessor="id" 
                identifier={item.statement.id}
            >
                <div
                    className={cs(
                        styles.accordionSection, 
                        open && styles.accordionSectionActive,
                        styles[`accordionSection${item.severity}`]
                    )}>
                    {open && (
                        <span
                            className={cs(
                                styles.concernSpan, 
                                styles[`concernSpan${item.severity}`]
                            )}>
                            {item.severity} concern
                        </span>
                    )}
                    <div className={styles.accordion} onClick={toggleAccordion}>
                        {item.statement.isExperimental &&
                            <FiAlertTriangle className={styles.experimentalIcon} title="This statement is in experimental phase currently and may not give accurate result." />
                        }
                        <div className={cs(
                            styles.accordionTitle, 
                            open && styles.activeTitle
                        )}>
                            {item.statement.title}
                        </div>
                        <div className={styles.rightSection}>
                            {!open && (
                                <span className={styles.span}>
                                    Mitigations, Opportunities and more
                                </span>
                            )}
                            <FiChevronRight className={cs(styles.downIcon, open && styles.rotateUp)} />
                        </div>
                    </div>
                    <div
                        ref={content}
                        style={{maxHeight: `${contentHeight}`}}
                        className={styles.accordionContent}>
                        <div className={styles.accordionText}>
                            {item.statement?.hints && (
                                <h3 className={styles.listTitle}>
                                    ADDITIONAL INFORMATION
                                </h3>
                            )}
                            {item.statement?.hints || ''}
                            <h3 className={styles.listTitle}>MITIGATION</h3>
                            <List
                                data={mitigations}
                                component="ul"
                                keyExtractor={keyExtractor}
                                renderItem={renderListData}
                            />
                            <h3 className={styles.listTitle}>OPPORTUNITY</h3>
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
    );
};

export default StatementAccordion;

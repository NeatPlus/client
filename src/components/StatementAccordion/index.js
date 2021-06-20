import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {FiChevronRight} from 'react-icons/fi';

import cs from '@ra/cs';
import List from '@ra/components/List';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './styles.scss';

const keyExtractor = item => item.id;

const StatementAccordion = ({item, isExpanded}) => {
    const [open, setOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState('0px');

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

    // FIXME: Use actual data for mitigations and opportunities
    const mitigations = useMemo(() => [], []);
    const opportunities = useMemo(() => [], []);

    if(!item.severity) {
        return null;
    }

    return (
        <div className={styles.accordionContainer}>
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
                    <div className={cs(
                        styles.accordionTitle, 
                        open && styles.activeTitle
                    )}>
                        {item.statement.title}
                    </div>
                    <div className={styles.rightSection}>
                        {!open &&
                            <span className={styles.span}>Mitigations, Opportunities and more</span>
                        }
                        <FiChevronRight className={cs(styles.downIcon, open && styles.rotateUp)} />
                    </div>
                </div>
                <div
                    ref={content}
                    style={{ maxHeight: `${contentHeight}` }}
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
                        <h3 className={styles.listTitle}>OPPORTUNITIES</h3>
                        <List
                            data={opportunities}
                            component="ul"
                            keyExtractor={keyExtractor}
                            renderItem={renderListData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementAccordion;

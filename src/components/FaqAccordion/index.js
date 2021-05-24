import React, {useState, useRef} from 'react';
import {FiChevronRight} from 'react-icons/fi';

import cs from '@ra/cs';

import styles from './styles.scss';

const FaqAccordion = ({question, answer}) => {
    const [open, setOpen] = useState('');
    const [contentHeight, setContentHeight] = useState('0px');

    const content = useRef(null);
  
    function toggleAccordion() {
        setOpen(open === '' ? 'active' : '');
        setContentHeight(
            open === 'active' ? '0px' : `${content.current.scrollHeight}px`
        );
    }
  
    return (
        <div className={styles.container}>
            <div className={cs(styles.accordionSection, open === 'active' && styles.accordionSectionActive)}>
                <button className={styles.accordion} onClick={toggleAccordion}>
                    <p className={cs(styles.accordionTitle, open === 'active' && styles.activeTitle)}>{question}</p>
                    <FiChevronRight className={cs(styles.downIcon, open === 'active' ? styles.rotateUp : '' )} />
                </button>
                <div
                    ref={content}
                    style={{ maxHeight: `${contentHeight}` }}
                    className={styles.accordionContent}
                >
                    <div
                        className={styles.accordionText}>
                        <div>{answer}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqAccordion;

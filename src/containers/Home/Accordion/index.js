import React, { useState } from 'react';
import styles from './styles.scss';
import { BsArrowRight } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';

const Accordion = ({ title, content }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className={styles.accordion}>
            <div className={styles.accordionTrigger} onClick={() => setIsActive(!isActive)}>

                <p >{title}
                </p>
                <p>
                    {isActive ? <MdClose className={styles.closeIcon} size="30px" /> : <BsArrowRight size="30px" />}
                </p>
            </div>
            { isActive && <div className={styles.accordionText} dangerouslySetInnerHTML={{ __html: content }}></div>}
        </div >
    );
};

export default Accordion;

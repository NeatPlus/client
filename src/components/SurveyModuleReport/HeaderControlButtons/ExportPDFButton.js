import React from 'react';
import {FiUpload} from 'react-icons/fi';

import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';

import styles from './styles.scss';

const ExportPDFButton = ({onClick}) => {
    return (
        <div onClick={onClick} className={cs(styles.button, 'no-print')}>
            <FiUpload />
            <span className={styles.buttonText}><Localize>Export PDF</Localize></span>
        </div>
    );

};

export default ExportPDFButton;

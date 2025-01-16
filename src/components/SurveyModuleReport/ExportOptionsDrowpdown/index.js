import React, { useCallback } from 'react';
import { FiDownload, FiFile, FiFileText } from 'react-icons/fi';
import { Localize } from '@ra/components/I18n';
import Dropdown from '@ra/components/Dropdown';
import styles from './styles.scss';

const ExportOptionsDropdown = ({ onExportPDF, onExportDocx }) => {
    const renderExportLabel = useCallback(() => {
        return (
            <div className={styles.optionsLabel}>
                <FiDownload />
                <span className={styles.optionsText}>
                    <Localize>Export</Localize>
                </span>
            </div>
        );
    }, []);

    return (
        <Dropdown
            labelContainerClassName={styles.optionsLabel}
            renderLabel={renderExportLabel}
            align='right'
        >
            <div className={styles.dropdownOptions}>
                <div 
                    className={styles.optionItem}
                    onClick={onExportPDF}
                    role="button"
                    tabIndex={0}
                >
                    <FiFileText className={styles.optionIcon} />
                    <span className={styles.optionText}>
                        <Localize>PDF</Localize>
                    </span>
                </div>
                <div 
                    className={styles.optionItem}
                    onClick={onExportDocx}
                    role="button"
                    tabIndex={0}
                >
                    <FiFile className={styles.optionIcon} />
                    <span className={styles.optionText}>
                        <Localize>DOCX</Localize>
                    </span>
                </div>
            </div>
        </Dropdown>
    );
};

export default ExportOptionsDropdown;

import React, { useCallback, useEffect, useState } from 'react';

import cs from '@ra/cs';
import { isArray } from '@ra/utils';

import styles from './styles.scss';

const TextareaInput = (props) => {
    const { showRequired, className, onChange, warning, errorMessage, required, ...inputProps } =
        props;

    const [meta, setMeta] = useState({
        invalid: false,
        touched: false,
        error: null,
        warning: warning
    });

    useEffect(() => {
        if (showRequired) {
            setMeta((prevMeta) => ({ ...prevMeta, warning: 'Required' }));
        }
        if (errorMessage) {
            setMeta((prevMeta) => ({
                ...prevMeta,
                error: isArray(errorMessage) ? errorMessage[0] : errorMessage
            }));
        }
    }, [showRequired, errorMessage]);

    const handleChange = useCallback(
        (event) => {
            setMeta((prevMeta) => ({
                ...prevMeta,
                error: null,
                warning: required && !event.target.value ? 'Required' : null,
                invalid: false,
                touched: true
            }));
            onChange(event.target);
        },
        [onChange, required]
    );

    return (
        <div className={styles.container}>
            <textarea
                className={cs(className, styles.textarea, {
                    [styles.textareaWarning]: meta.warning
                })}
                onChange={handleChange}
                rows={4}
                cols={5}
                {...inputProps}
            />
            {Boolean(meta.warning) && <span className={styles.warningText}>{meta.warning}</span>}
        </div>
    );
};

export default TextareaInput;

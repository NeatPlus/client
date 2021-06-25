import {useCallback} from 'react';

const TextAreaInput = ({onChange, ...otherProps}) => {
    const handleChange = useCallback(e => {
        onChange && onChange(e.target);
    }, [onChange]);

    return (
        <textarea
            rows={4}
            cols={5}
            onChange={handleChange}
            {...otherProps}
        />
    );
};

export default TextAreaInput;

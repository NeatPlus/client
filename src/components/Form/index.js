import React, {useCallback} from 'react';

const getChildren = children => React.Children.toArray(children);

const noop = () => {};

const Form = (props) => {
    const {
        children, 
        onSubmit = noop, 
        ...formProps
    } = props;

    const _children = React.useMemo(() => getChildren(children), [children]);

    const handleSubmitForm = useCallback((event) => {
        event.preventDefault();
        onSubmit();
    }, [onSubmit]);

    return (
        <form {...formProps} onSubmit={handleSubmitForm}>
            {_children}
        </form>
    );
};

export default Form;


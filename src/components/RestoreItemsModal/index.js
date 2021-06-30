import {useCallback, useMemo, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {MdClose} from 'react-icons/md';
import {FiChevronRight} from 'react-icons/fi';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import List from '@ra/components/List';
import CheckboxInput from '@ra/components/Form/CheckboxInput';

import cs from '@ra/cs';
import * as dashboardActions from 'store/actions/dashboard';

import styles from './styles.scss';

const REMOVABLE_TYPES = [
    {
        title: 'Topics',
        type: 'topic',
    },
    {
        title: 'Statements',
        type: 'statement',
    },
];

const typeExtractor = item => item.type;
const keyExtractor = item => item.id;

const CheckboxItem = ({item}) => {
    const dispatch = useDispatch();
    const {itemsToRestore} = useSelector(state => state.dashboard);

    const handleChange = useCallback(({checked}) => {
        if(checked) {
            return dispatch(dashboardActions.setItemsToRestore([...itemsToRestore, item]));
        }
        dispatch(dashboardActions.setItemsToRestore(itemsToRestore.filter(
            el => el.type !== item.type && el.identifier !== item.identifier)
        ));
    }, [dispatch, itemsToRestore, item]);

    return (
        <div className={styles.listItem}>
            <CheckboxInput
                size={18}
                id={item.identifier} 
                onChange={handleChange}
            />
            <label htmlFor={item.identifier} className={styles.label}>
                {item.title}
            </label>
        </div> 
    );
};

const RestoreType = ({item, onInputChange}) => {
    const content = useRef();

    const {removedItems} = useSelector(state => state.dashboard);
    const {statements, topics} = useSelector(state => state.statement);

    const listItems = useMemo(() => {
        let data = [];
        if(item.type === 'topic') {
            data = topics;
        } else if(item.type === 'statement') {
            data = statements;
        }

        return removedItems?.filter(el => el.type===item.type)?.map(
            el => ({
                ...el, 
                title: data.find(dt => 
                    dt[el.accessor] === el.identifier
                )?.title,
            }));
    }, [item, topics, statements, removedItems]);

    const [open, setOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState('0px');

    const toggleAccordion = useCallback((type, value) => {
        setOpen(!open);
        setContentHeight(
            open ? '0px' : `${content.current.scrollHeight}px`
        );
    }, [open]);

    const renderCheckboxItem = useCallback((listProps) => (
        <CheckboxItem {...listProps} onChange={onInputChange} />
    ), [onInputChange]);

    return (
        <div className={styles.accordionContainer}>
            <div className={styles.accordion} onClick={toggleAccordion}>
                <div className={cs(
                    styles.accordionTitle, 
                    open && styles.activeTitle
                )}>
                    {item.title} ({listItems.length})
                </div>
                <div className={styles.rightSection}>
                    <FiChevronRight className={cs(styles.downIcon, open && styles.rotateUp)} />
                </div>
            </div>
            <div
                ref={content}
                style={{ maxHeight: `${contentHeight}` }}
                className={styles.accordionContent}>
                <List 
                    className={styles.list}
                    data={listItems}
                    renderItem={renderCheckboxItem}
                    keyExtractor={keyExtractor}
                />
            </div>
        </div>
    );
};

const RestoreItemsModal = props => {
    const dispatch = useDispatch();
        
    const {isVisible, onClose} = props;

    const handleClose = useCallback(() => {
        dispatch(dashboardActions.setItemsToRestore([]));
        onClose && onClose();
    }, [onClose, dispatch]);

    const handleRestoreClick = useCallback(() => {
        dispatch(dashboardActions.applyRestoreItems());
        handleClose();
    }, [dispatch, handleClose]);

    if(!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}>Restore Items</h2>
                <div className={styles.closeContainer} onClick={handleClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <List
                    data={REMOVABLE_TYPES}
                    renderItem={RestoreType}
                    keyExtractor={typeExtractor}
                />

            </div>
            <div className={styles.buttons}>
                <Button
                    type='button'
                    secondary
                    className={styles.button}
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button onClick={handleRestoreClick} className={styles.button}>
                    Restore
                </Button>
            </div>
        </Modal>
    ); 

};

export default RestoreItemsModal;
import {useCallback, useMemo, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {MdClose} from 'react-icons/md';
import {FiChevronRight} from 'react-icons/fi';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import List from '@ra/components/List';
import CheckboxInput from '@ra/components/Form/CheckboxInput';
import {Localize} from '@ra/components/I18n';

import cs from '@ra/cs';
import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';

import Api from 'services/api';
import {_} from 'services/i18n';
import Toast from 'services/toast';
import * as dashboardActions from 'store/actions/dashboard';

import styles from './styles.scss';

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

const RestoreType = ({item, onInputChange, module}) => {
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

        return removedItems?.filter(el => {
            if(module === 'sens') {
                return (el.module === module || !el.module) && el.type === item.type;
            }
            return el.module === module && el.type===item.type;
        })?.map(
            el => ({
                ...el, 
                title: data.find(dt => 
                    dt[el.accessor] === el.identifier
                )?.title,
            }));
    }, [item, topics, statements, removedItems, module]);

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

    const REMOVABLE_TYPES = useMemo(() => ([
        {
            title: _('Topics'),
            type: 'topic',
        },
        {
            title: _('Statements'),
            type: 'statement',
        },
    ]), []);

    const {removedItems, itemsToRestore} = useSelector(state => state.dashboard);
    const {activeSurvey} = useSelector(state => state.survey);
        
    const {isVisible, onClose, module} = props;

    const [{loading}, saveSurveyConfig] = usePromise(Api.patchSurvey);

    const handleClose = useCallback(() => {
        dispatch(dashboardActions.setItemsToRestore([]));
        onClose && onClose();
    }, [onClose, dispatch]);

    const handleRestoreClick = useCallback(async () => {
        const newRemovedItems = removedItems.filter(item => {
            return !itemsToRestore.some(
                el => el.type===item.type && el.identifier === item.identifier
            );
        });
        try {
            await saveSurveyConfig(activeSurvey.id, {
                config: JSON.stringify({removedItems: newRemovedItems}),
            });
            dispatch(dashboardActions.applyRestoreItems(newRemovedItems));
            handleClose();
        } catch(error) {
            Toast.show(getErrorMessage(error), Toast.DANGER);
            console.log(error);
        }
    }, [
        dispatch, 
        handleClose, 
        removedItems, 
        itemsToRestore, 
        saveSurveyConfig, 
        activeSurvey
    ]);

    const renderRestoreType = useCallback(listProps => (
        <RestoreType {...listProps} module={module} />
    ), [module]);

    if(!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Restore Items</Localize></h2>
                <div className={styles.closeContainer} onClick={handleClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <List
                    data={REMOVABLE_TYPES}
                    renderItem={renderRestoreType}
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
                    <Localize>Cancel</Localize>
                </Button>
                <Button 
                    loading={loading} 
                    onClick={handleRestoreClick} 
                    className={styles.button}
                >
                    <Localize>Restore</Localize>
                </Button>
            </div>
        </Modal>
    ); 

};

export default RestoreItemsModal;

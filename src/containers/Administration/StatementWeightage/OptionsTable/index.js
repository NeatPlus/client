import {useMemo, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {MdRefresh} from 'react-icons/md';

import WeightageInput from 'components/WeightageInput';
import Table from '@ra/components/Table';
import {Localize} from '@ra/components/I18n';

import {setChangedOptions} from 'store/actions/admin';

import {_} from 'services/i18n';
import cs from '@ra/cs';

import styles from './styles.scss';

const HeaderItem = ({column}) => {
    if(column.Header === _('Weightage')) {
        return (
            <div className={styles.weightageItem}>
                {column.Header}
            </div>
        );
    }
    if(column.Header === 'Undo') {
        return null;
    }
    return column.Header;
};

const DataItem = props => {
    const {item, index, column} = props;
   
    const dispatch = useDispatch();
    const {changedOptions} = useSelector(state => state.admin);

    const isWeightageChanged = useMemo(() => {
        return changedOptions.some(opt => opt.option === item.id);
    }, [changedOptions, item]);

    const handleUndoClick = useCallback(e => {
        const newChangedOptions = changedOptions.filter(opt => opt.option !== item.id);
        dispatch(setChangedOptions(newChangedOptions));
    }, [dispatch, changedOptions, item]);

    const inputRef = useRef();

    if(column.Header === _('Options')) {
        return (
            <div className={cs(styles.nameItem, {[styles.nameItemEmpty]: !item.weightage})}>
                {item?.[column.accessor]}
            </div>
        );
    }
    if(column.Header === _('S.N.')) {
        return <span className={cs({[styles.numberEmpty]: !item.weightage})}>{index+1}.</span>;
    }
    if(column.Header === _('Weightage')) {
        return (
            <WeightageInput ref={inputRef} {...props} />
        );
    }
    if(column.Header === 'Undo' && isWeightageChanged) {
        return (
            <MdRefresh className={styles.undoIcon} size={18} onClick={handleUndoClick} />
        );
    }
    return item?.[column.accessor] ?? ' ';
};

const OptionsTable = props => {
    const {
        activeOptions,
        ...tableProps
    } = props;

    const {changedOptions} = useSelector(state => state.admin);

    const columns = useMemo(() => ([
        {
            Header: _('S.N.'),
            accessor: '',
        }, {
            Header: _('Options'),
            accessor: 'title',
        }, {
            Header: _('Weightage'),
            accessor: 'weightage',
        }, {
            Header: 'Undo',
            accessor: '',
        },
    ]), []);

    const editedOptions = useMemo(() => {
        return activeOptions?.map(opt => {
            const changedWeightageOption = changedOptions.find(chOpt => chOpt.option === opt.id);
            if(changedWeightageOption) {
                return {
                    ...opt,
                    weightage: changedWeightageOption.weightage,
                };
            }
            return opt;
        }) || [];
    }, [activeOptions, changedOptions]);

    return (
        <div className={styles.optionsTableContainer}>
            <Table 
                className={styles.table}
                data={editedOptions}
                columns={columns}
                maxRows={activeOptions?.length}
                renderDataItem={DataItem}
                renderHeaderItem={HeaderItem}
                headerClassName={styles.tableHeader}
                headerRowClassName={styles.headerRow}
                bodyClassName={styles.tableBody}
                bodyRowClassName={styles.bodyRow}
                LoadingComponent={<p className={styles.statusMessage}>
                    <Localize>Loading options...</Localize>
                </p>}
                EmptyComponent={<p className={styles.statusMessage}>
                    <Localize>No options found.</Localize>
                </p>}
                {...tableProps}
            />
        </div> 
    );
};

export default OptionsTable;

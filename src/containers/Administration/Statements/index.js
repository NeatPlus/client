import {useOutletContext} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {Localize} from '@ra/components/I18n';
import SelectInput from '@ra/components/Form/SelectInput';

import {_} from 'services/i18n';

import StatementsTable from './StatementsTable';
import styles from './styles.scss';

const valueExtractor = item => item?.title;
const keyExtractor = item => item.id;

const Statements = () => {
    const {contexts, modules} = useSelector(state => state.context);

    const {activeContext, activeModule, onContextChange, onModuleChange} = useOutletContext();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}><Localize>Statements</Localize></h1>
                    <div className={styles.selectors}>
                        <SelectInput
                            component={SelectInput}
                            className={styles.input}
                            options={contexts}
                            valueExtractor={valueExtractor}
                            keyExtractor={keyExtractor}
                            clearable={false}
                            searchable={false}
                            placeholder={_('Context')}
                            defaultValue={activeContext}
                            onChange={onContextChange}
                        />
                        <SelectInput
                            component={SelectInput}
                            className={styles.input}
                            options={modules}
                            valueExtractor={valueExtractor}
                            keyExtractor={keyExtractor}
                            clearable={false}
                            searchable={false}
                            placeholder={_('Module')}
                            defaultValue={activeModule}
                            onChange={onModuleChange}
                        />
                    </div>
                </header>
                <StatementsTable activeContext={activeContext} activeModule={activeModule} />
            </div>
        </div>
    );
};

export default Statements;

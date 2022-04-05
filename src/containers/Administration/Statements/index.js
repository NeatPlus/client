import {BsPlus} from 'react-icons/bs';

import Button from 'components/Button';
import {Localize} from '@ra/components/I18n';
import SelectInput from '@ra/components/Form/SelectInput';

import {_} from 'services/i18n';

import StatementsTable from './StatementsTable';
import styles from './styles.scss';

const valueExtractor = item => item?.title;
const keyExtractor = item => item.id;

const Statements = props => {
    const {contexts, modules, onContextChange, onModuleChange, defaultContext, defaultModule} = props;

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
                            defaultValue={defaultContext}
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
                            defaultValue={defaultModule}
                            onChange={onModuleChange}
                        />
                    </div>
                    <Button 
                        outline 
                        className={styles.button}
                    >
                        <BsPlus size={24} className={styles.buttonIcon} />
                        <Localize>Add statements</Localize>
                    </Button>
                </header>
                <StatementsTable />
            </div>
        </div>
    );
};

export default Statements;

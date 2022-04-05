import {useMemo, useState, useCallback, useEffect} from 'react';
import {Route, Switch, Redirect, useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';

import UserNav from 'components/UserNav';

import cs from '@ra/cs';
import {weightagePermissions} from 'utils/permission';
import usePermissions from 'hooks/usePermissions';
import Toast from 'services/toast';
import {_} from 'services/i18n';

import Statements from './Statements';
import StatementDetails from './StatementDetails';
import StatementWeightage from './StatementWeightage';

import styles from './styles.scss';

const Projects = () => {
    const {contexts, modules} = useSelector(state => state.context);
    const {user} = useSelector(state => state.auth);

    const history = useHistory();

    const defaultContext = useMemo(() => contexts.find(ctx => ctx?.code === 'urban'), [contexts]);
    const defaultModule = useMemo(() => modules.find(mod => mod?.code === 'sens'), [modules]);

    const [activeContext, setActiveContext] = useState(defaultContext);
    const [activeModule, setActiveModule] = useState(defaultModule);

    const handleContextChange = useCallback(({option}) => setActiveContext(option), []);
    const handleModuleChange = useCallback(({option}) => setActiveModule(option), []);

    const [hasWeightagePermissions] = usePermissions(weightagePermissions);
    const hasAccess = useMemo(() => hasWeightagePermissions || user?.isSuperuser, [user, hasWeightagePermissions]);

    useEffect(() => {
        if(user && !hasAccess) {
            Toast.show(_('You do not have administration access!'), Toast.DANGER);
            return history.push('/projects/');
        }
    }, [history, user, hasAccess]);

    return (
        <div className={cs(styles.container, 'no-bgcolor')}>
            <UserNav />
            <Switch>
                <Route exact path='/administration/statements/'>
                    <Statements contexts={contexts} modules={modules} onContextChange={handleContextChange} onModuleChange={handleModuleChange} />
                </Route>
                <Route exact path='/administration/statements/:statementId'>
                    <StatementDetails
                        activeContext={activeContext ?? defaultContext}
                        activeModule={activeModule ?? defaultModule}
                    />
                </Route>
                <Route exact path='/administration/statements/:statementId/weightage'>
                    <StatementWeightage
                        activeContext={activeContext ?? defaultContext}
                        activeModule={activeModule ?? defaultModule}
                    />
                </Route>
                <Redirect from='/administration' to='/administration/statements' />
            </Switch>
        </div>
    );
};

export default Projects;

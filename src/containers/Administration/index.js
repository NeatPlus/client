import {useMemo, useState, useCallback, useEffect} from 'react';
import {useNavigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

import UserNav from 'components/UserNav';

import cs from '@ra/cs';
import {weightagePermissions} from 'utils/permission';
import usePermissions from 'hooks/usePermissions';
import Toast from 'services/toast';
import {_} from 'services/i18n';

import styles from './styles.scss';

const Administration = () => {
    const {contexts, modules} = useSelector(state => state.context);
    const {user} = useSelector(state => state.auth);

    const navigate = useNavigate();

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
            return navigate('/projects/');
        }
    }, [navigate, user, hasAccess]);

    return (
        <div className={cs(styles.container, 'no-bgcolor')}>
            <UserNav />
            <Outlet context={{
                activeContext: activeContext ?? defaultContext,
                activeModule: activeModule ?? defaultModule,
                onContextChange: handleContextChange,
                onModuleChange: handleModuleChange
            }} />
        </div>
    );
};

export default Administration;

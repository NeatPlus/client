import {useMemo} from 'react';
import {useSelector} from 'react-redux';

const usePermissions = requiredPermissions => {
    const {user, isAuthenticated} = useSelector(state => state.auth);

    const hasRequiredPermissions = useMemo(() => {
        if(!isAuthenticated) {
            return false;
        }
        const allPermissions = user?.permissions;
        if(allPermissions?.length > 0) {
            return requiredPermissions.every(per => allPermissions.includes(per));
        }
        return false;
    }, [isAuthenticated, user, requiredPermissions]);

    return [hasRequiredPermissions];
};

export default usePermissions;

import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

const AuthRoute = ({children}) => {
    const {isAuthenticated} = useSelector(state => state.auth);

    const location = useLocation();

    if(isAuthenticated) {
        return <Navigate to="/" state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
};

export default AuthRoute;

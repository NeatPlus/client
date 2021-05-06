import {Route, Switch} from 'react-router-dom';
import { useSelector } from 'react-redux';

import {PrivateRoute} from '@ra/auth/PrivateRoute';
import Toast from 'components/Toast';

import Home from 'containers/Home';
import Login from 'containers/Login';
import Register from 'containers/Register';
import Projects from 'containers/Projects';

const Routes = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <PrivateRoute path="/projects" component={Projects} isAuthenticated={isAuthenticated || true} /> {/* FIXME: Use actual auth state*/}
                <Route exact path="/" component={Home} />
            </Switch>
            <Toast />
        </>
    );
};

export default Routes;


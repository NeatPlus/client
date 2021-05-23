import {Route, Switch} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {PrivateRoute} from '@ra/auth/PrivateRoute';
import Toast from 'components/Toast';

import Home from 'containers/Home';
import Login from 'containers/Login';
import Register from 'containers/Register';
import Projects from 'containers/Projects';
import About from 'containers/About';
import Access from 'containers/Access';
import Action from 'containers/Action';

const Routes = () => {
    const {isAuthenticated} = useSelector((state) => state.auth);

    return (
        <>
            <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
                <PrivateRoute
                    path='/projects'
                    component={Projects}
                    isAuthenticated={isAuthenticated || true}
                />{' '}
                {/* FIXME: Use actual auth state*/}
                <Route exact path='/' component={Home} />
                <Route exact path='/about' component={About} />
                <Route exact path='/access' component={Access} />
                <PrivateRoute
                    path='/projects'
                    component={Projects}
                    isAuthenticated={isAuthenticated || true}
                />{' '}
                {/* FIXME: Use actual auth state*/}
                <Route exact path='/action' component={Action} />
            </Switch>
            <Toast />
        </>
    );
};

export default Routes;

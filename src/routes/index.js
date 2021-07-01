import React, {useEffect} from 'react';

import {Route, Switch, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {PrivateRoute} from '@ra/auth/PrivateRoute';
import {AuthRoute} from '@ra/auth/AuthRoute';

import Toast from 'components/Toast';
import Notice from 'components/Notice';

import Home from 'containers/Home';
import Login from 'containers/Login';
import Register from 'containers/Register';
import Projects from 'containers/Projects';
import About from 'containers/About';
import Access from 'containers/Access';
import Action from 'containers/Action';
import Contact from 'containers/Contact';
import Resources from 'containers/Resources';
import Account from 'containers/Account';

const Routes = () => {
    const {pathname} = useLocation();
    const {isAuthenticated} = useSelector((state) => state.auth);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [pathname]);

    return (
        <>
            {isAuthenticated && <Notice />}
            <Switch>
                <AuthRoute isAuthenticated={isAuthenticated} exact path="/login" component={Login} />
                <AuthRoute isAuthenticated={isAuthenticated} exact path="/register" component={Register} />
                <PrivateRoute path="/projects" component={Projects} isAuthenticated={isAuthenticated} />
                <PrivateRoute path="/account" component={Account} isAuthenticated={isAuthenticated} />
                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path='/contact' component={Contact} />
                <Route exact path="/access" component={Access} />
                <Route exact path='/action' component={Action} />
                <Route exact path='/resource' component={Resources} />
            </Switch>
            <Toast />
        </>
    );
};

export default Routes;

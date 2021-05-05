import {Route, Switch} from 'react-router-dom';

import Toast from 'components/Toast';

import Home from 'containers/Home';
import Login from 'containers/Login';
import Register from 'containers/Register';

const Routes = () => {
    return (
        <>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
            </Switch>
            <Toast />
        </>
    );
};

export default Routes;


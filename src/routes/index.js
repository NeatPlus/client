import {Route, Switch} from 'react-router-dom';

import Toast from 'components/Toast';

import Home from 'containers/Home';

const Routes = () => {
    return (
        <>
            <Switch>
                <Route exact path="/" component={Home} />
            </Switch>
            <Toast />
        </>
    );
};

export default Routes;


import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Routes from 'routes';
import store, {persistor} from 'store';

import 'services/bootstrap';

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;

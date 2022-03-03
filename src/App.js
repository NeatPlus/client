import {useMemo} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Routes from 'routes';
import store, {persistor} from 'store';

import SyncLocaleStore from 'components/SyncLocaleStore';
import LocalizeProvider from '@ra/components/I18n';
import {languages, translations} from 'services/i18n';

import 'services/bootstrap';

function App() {
    const initialLang = useMemo(() => 'en', []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <LocalizeProvider
                    translations={translations}
                    languages={languages}
                    defaultLanguage={initialLang}>
                    <SyncLocaleStore>
                        <BrowserRouter>
                            <Routes />
                        </BrowserRouter>
                    </SyncLocaleStore>
                </LocalizeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;

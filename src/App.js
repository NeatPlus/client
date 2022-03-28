import {useMemo, useCallback} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Routes from 'routes';
import store, {persistor} from 'store';

import SyncLocaleStore from 'components/SyncLocaleStore';
import LocalizeProvider from '@ra/components/I18n';
import {languages, translations} from 'services/i18n';

import {bootstrapApp} from 'services/bootstrap';

function App() {
    const initialLang = useMemo(() => 'en', []);

    const onBeforeLift = useCallback(async () => {
        await bootstrapApp();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
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

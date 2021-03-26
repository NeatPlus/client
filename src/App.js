import {BrowserRouter} from 'react-router-dom';

import Routes from 'routes';

import 'styles/_base.scss';

function App() {
    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    );
}

export default App;

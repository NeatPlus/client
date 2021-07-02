import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import ReactGA from 'react-ga';

const usePageViews = () => {
    let location = useLocation();
    useEffect(() => {
        ReactGA.pageview(location.pathname + location.search);
    }, [location]);
};

export default usePageViews;

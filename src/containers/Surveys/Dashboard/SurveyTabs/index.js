import {useCallback, useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import Tabs, {Tab} from 'components/Tabs';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import {AVAILABLE_SURVEY_MODULES} from 'utils/config';

import Overview from '../Overview';
import Module from '../Module';

import styles from './styles.scss';

const SurveyTabs = props => {
    const {activeTab, onTabChange, renderHeaderControls, publicMode} = props;

    const [searchParams] = useSearchParams();

    const {modules} = useSelector(state => state.context);
    const {activeSurvey} = useSelector(state => state.survey);

    const renderSpacer = useCallback(() => {
        if (activeTab==='overview' || publicMode || searchParams.get('mode') === 'compact') {
            return null;
        }
        return <div className={cs(styles.spacer, 'no-print')} />;
    }, [activeTab, publicMode, searchParams]);

    const availableModules = useMemo(() => modules.filter(mod => {
        return AVAILABLE_SURVEY_MODULES.includes(mod.code);
    }), [modules]);

    const availablePublicModules = useMemo(() => availableModules.filter(mod => {
        return activeSurvey?.results.some(res => res.module === mod.id);
    }).map(el => el.code), [availableModules, activeSurvey]);

    const renderModuleTab = useCallback(module => {
        if(publicMode && !availablePublicModules.includes(module.code)) {
            return null;
        }

        const label = module.code==='sens' ? 'sensitivity' : module.code;

        return (
            <Tab key={module.id} label={label} title={module.title}>
                <Module code={module.code} publicMode={publicMode} />
            </Tab>
        );
    }, [publicMode, availablePublicModules]);

    const renderHeader = useCallback(({active, title, className, activeClassName, ...otherProps}) => {
        return (
            <div className={cs(
                styles.tabsHeaderItem,
                className,
                {
                    [styles.tabsHeaderItemActive]: active,
                    [activeClassName]: active,
                    'no-print': !active,
                }
            )} {...otherProps}>
                {title}
            </div>
        );
    }, []);

    return (
        <Tabs 
            activeTab={activeTab}
            secondary 
            className={styles.tabs}
            PreHeaderComponent={renderSpacer}
            PostHeaderComponent={renderHeaderControls}
            headerContainerClassName={styles.headerContainer}
            headerClassName={styles.tabsHeader}
            activeTabItemClassName="no-print"
            contentContainerClassName={styles.tabContent}
            renderHeader={renderHeader}
            onChange={onTabChange}
        >
            <Tab label="overview" title={_('Overview')}>
                <Overview />
            </Tab>
            {modules.map(renderModuleTab)}
        </Tabs>
    );
};

export default SurveyTabs;

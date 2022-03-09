import {useCallback, useMemo} from 'react';
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

    const {modules} = useSelector(state => state.context);
    const {activeSurvey} = useSelector(state => state.survey);

    const renderSpacer = useCallback(() => {
        if (activeTab==='overview' || publicMode) {
            return null;
        }
        return <div className={styles.spacer} />;
    }, [activeTab, publicMode]);

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

        const label = module.code==='sens' ? _('sensitivity') : module.code;

        return (
            <Tab key={module.id} label={label} title={module.title}>
                <Module code={module.code} />
            </Tab>
        );
    }, [publicMode, availablePublicModules]);

    return (
        <Tabs 
            activeTab={activeTab}
            secondary 
            className={styles.tabs}
            PreHeaderComponent={renderSpacer}
            PostHeaderComponent={renderHeaderControls}
            headerContainerClassName={cs(styles.headerContainer, 'no-print')}
            headerClassName={styles.tabsHeader}
            tabItemClassName={styles.headerItem}
            contentContainerClassName={styles.tabContent}
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

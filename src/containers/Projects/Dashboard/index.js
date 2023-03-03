import {useCallback, useMemo} from 'react';
import {Link, useLocation, useParams, useNavigate} from 'react-router-dom';

import {useSelector} from 'react-redux';
import {BiChevronLeft} from 'react-icons/bi';

import SurveyModals from 'components/SurveyModals';
import {withNoSurvey} from 'components/NoSurvey';
import Tabs, {Tab} from 'components/Tabs';
import Map from 'components/Map';
import ConcernsTable from 'components/Concerns/Table';
import ConcernsChart from 'components/Concerns/Chart';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import SurveyList from 'containers/Surveys/List';

import useSurveyModals from 'hooks/useSurveyModals';
import useInitActiveProject from 'hooks/useInitActiveProject';
import {getFormattedSurveys} from 'store/selectors/survey';

import SurveyTable from './SurveyTable';
import styles from './styles.scss';

const ProjectDashboard = withNoSurvey(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const {projectId} = useParams();

    useInitActiveProject(projectId);

    const surveyModalsConfig = useSurveyModals('sens');

    const {activeProject} = useSelector(state => state.project);
    const surveys = useSelector(getFormattedSurveys);
    const {topics} = useSelector(state => state.statement);

    const projectSurveys = useMemo(() => {
        return surveys.filter(sur => sur.project === +projectId);
    }, [surveys, projectId]);

    const projectLocations = useMemo(() => {
        return projectSurveys.flatMap(sur => 
            sur.answers.filter(el => el.question.code === 'coords')
                .map(ans => ans.formattedAnswer)
        );
    }, [projectSurveys]);

    const projectResults = useMemo(() => {
        return projectSurveys.flatMap(sur => sur.results);
    }, [projectSurveys]);

    const concernsData = useMemo(() => {
        return topics.map(topic => {
            const topicResults = projectResults.filter(res => res.topic === topic.id);
            const highCount = topicResults.filter(res => 
                res.severity === _('High')
            ).length;
            const mediumCount = topicResults.filter(res => 
                res.severity === _('Medium')
            ).length;
            const lowCount = topicResults.filter(res => 
                res.severity === _('Low')
            ).length; 
            const totalCount = highCount + mediumCount + lowCount;
            return {
                icon: topic.icon,
                topic: topic.title,
                highCount,
                mediumCount,
                lowCount,
                totalCount,
            };
        });
    }, [topics, projectResults]);

    const topConcerns = useMemo(() => 
        concernsData?.sort((a, b) => {
            return (b.highCount - a.highCount) || (b.mediumCount - a.mediumCount) || (b.lowCount - a.lowCount);
        })?.slice(0, 4), 
    [concernsData]);

    const handleTabChange = useCallback(({activeTab}) => {
        if(activeTab === 'summary') {
            return navigate(`/projects/${projectId}/`);
        }
        return navigate(`/projects/${projectId}/surveys/`);
    }, [projectId, navigate]);

    return (
        <div className={styles.container}>
            <Link to="/projects" className={styles.backLink}>
                <BiChevronLeft size={22} className={styles.backIcon} /> <Localize>Back to Projects</Localize>
            </Link>
            <Tabs 
                activeTab={location.pathname.includes('surveys') ? 'surveys' : 'summary'}
                secondary 
                className={styles.tabs}
                headerClassName={styles.tabsHeader}
                onChange={handleTabChange}
            >
                <Tab label="summary" title={_('Summary')}>
                    <div className={styles.summaryContainer}>
                        <SurveyTable
                            onTakeSurveyClick={surveyModalsConfig.handleShowDeleteDraft}
                            clonable={Boolean(projectResults.length)}
                        />
                        <div className={styles.overview}>
                            <h3 className={styles.overviewTitle}>
                                <Localize>Overview</Localize>
                            </h3>
                            <div className={styles.overviewContent}>
                                <div className={styles.concerns}>
                                    <h4 className={styles.concernsTitle}>
                                        <Localize>Top concerns topics</Localize>
                                    </h4>
                                    <div className={styles.concernsTable}>
                                        <ConcernsTable 
                                            loading={!projectResults.length}
                                            concerns={topConcerns}
                                        />
                                    </div>
                                    <div className={styles.concernsChart}>
                                        <ConcernsChart concerns={concernsData} />
                                    </div>
                                </div>
                                <div className={styles.location}>
                                    <h4 className={styles.locationTitle}>
                                        <Localize>Number of issues of concern by location</Localize>
                                    </h4>
                                    <div className={styles.map}>
                                        <Map 
                                            project={activeProject} 
                                            features={projectLocations} 
                                            showPopup 
                                            width={400}
                                            height={500}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab label="surveys" title={_('Surveys')}>
                    <SurveyList />
                </Tab>
            </Tabs>
            <SurveyModals {...surveyModalsConfig} />
        </div>
    );
});

export default ProjectDashboard;

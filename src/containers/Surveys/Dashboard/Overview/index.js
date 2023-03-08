import React, {useCallback, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import SVG from 'react-inlinesvg';
import {IoIosArrowRoundForward} from 'react-icons/io';

import {NeatLoader} from 'components/Loader';
import Map from 'components/Map';
import SummaryModal from 'components/SummaryModal';
import ImageViewerModal from 'components/ImageViewerModal';

import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import Image from '@ra/components/Image';

import {_} from 'services/i18n';
import store from 'store';

import cs from '@ra/cs';
import {getSeverityCounts} from 'utils/severity';
import iconPlaceholder from 'assets/icons/topic-icon-placeholder.svg';

import styles from './styles.scss';

const keyExtractor = item => item;
const idExtractor = item => item.id;
const severityExtractor = item => item.severity;

const getLocaleDate = (dateStr) => {
    const date = new Date(dateStr);
    if(!dateStr || !date) {
        return '';
    }
    return date.toLocaleDateString();
};

const InfoItem = ({title, value}) => {
    return (
        <>
            <p className={styles.infoTitle}>{title}</p>
            <p className={styles.infoValue}>{value || '-'}</p>
        </>
    );
};

const ConcernItem = ({item, module, onClick}) => {
    const handleClick = useCallback(() => {
        onClick && onClick(item.severity, module);
    }, [item, onClick, module]);

    return (
        <div 
            className={cs(styles.concernsItem, {
                [styles.concernsItemHigh]: item.severity===_('High'),
                [styles.concernsItemMedium]: item.severity===_('Medium'),
                [styles.concernsItemLow]: item.severity===_('Low'),
            })}
            onClick={handleClick}
        >
            <p className={styles.concernNumber}>{item.count}</p>
            <div className={styles.concernDescription}>
                <p className={styles.concernLabel}>{item.severity} <Localize>Concerns</Localize></p>
                <IoIosArrowRoundForward size={20} className={styles.concernIcon} />
            </div>
        </div>
    );
};

const ImageItem = React.memo(({item, index, onClick}) => {
    const handleClick = useCallback(() => onClick?.(index), [index, onClick]);

    return (
        <Image
            className={styles.mediaItem}
            src={item}
            alt={`Survey Media ${index + 1}`}
            onClick={handleClick}
        />
    );
});

const ActivityModuleCard = ({item, activeSurvey, renderConcernItem}) => {
    const severityCountData = useMemo(() => {
        return getSeverityCounts(activeSurvey?.results?.filter(res => {
            return res && res.module === item?.id;
        }) || []);
    }, [activeSurvey, item]);

    const hasNoConcerns = useMemo(() => {
        return severityCountData.every(dt => dt.count === 0);
    }, [severityCountData]);

    const renderActivityConcernItem = useCallback(listProps => renderConcernItem({...listProps, module: item}), [item, renderConcernItem]);

    return (
        <div className={styles.moduleCard}>
            <div className={styles.moduleCardHeader}>
                <SVG
                    className={styles.moduleCardHeaderIcon}
                    src={item.icon || iconPlaceholder}
                    width={18}
                    title={item.title}
                >
                    <SVG
                        className={styles.moduleCardHeaderIcon}
                        width={18}
                        src={iconPlaceholder}
                        title={item.title}
                    />
                </SVG>
                <h5 className={styles.moduleCardTitle}>
                    {item.title}
                </h5>
            </div>
            <div className={styles.moduleDescription}>
                {item.description}
            </div>
            {hasNoConcerns ? (
                <div className={styles.noConcerns}>
                    {activeSurvey?.results?.some(res => res && res.module === item.id) ? (
                        <Localize>No concerns</Localize>
                    ) : (
                        <Localize>Not completed</Localize>
                    )}
                </div>
            ) : (
                <List
                    className={styles.moduleConcerns}
                    data={severityCountData}
                    keyExtractor={severityExtractor}
                    renderItem={renderActivityConcernItem}
                />
            )}
        </div>
    );
};

const getSurveyAnswerFromCode = (code, formatted) => {
    const {survey: {activeSurvey}} = store.getState();
    const answer = activeSurvey?.answers?.find(ans => ans.question.code === code)?.[formatted ? 'formattedAnswer' : 'answer'];
    if(answer) {
        return answer;
    }
    return '';
};

const MediaItem = ({activeSurvey}) => {
    const [initialImageIndex, setInitialImageIndex] = useState(0);
    const [showImageViewer, setShowImageViewer] = useState(false);

    const handleImageClick = useCallback(index => {
        if(index > -1) {
            setInitialImageIndex(index);
        }
        setShowImageViewer(true);
    }, []);
    const handleCloseImageViewer = useCallback(() => setShowImageViewer(false), []);

    const renderMedia = useCallback(listProps => {
        return (
            <ImageItem {...listProps} onClick={handleImageClick} />
        );
    }, [handleImageClick]);

    const [mediaData, moreMediaCount, allMedia] = useMemo(() => {
        let images = getSurveyAnswerFromCode('s3q2', true);
        if(images && typeof images === 'string') {
            images = [images];
        }
        if(images?.length > 5) {
            return [images.slice(0, 5), images.length - 5, images];
        }
        return [images, 0];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSurvey?.id]);

    const MediaCount = useMemo(() => {
        if(moreMediaCount > 0) {
            return <span className={styles.moreMediaCount} onClick={handleImageClick}>+{moreMediaCount}</span>;
        }
        return null;
    }, [moreMediaCount, handleImageClick]);

    if(!mediaData?.length) {
        return null;
    }

    return (
        <>
            <p className={cs(styles.infoTitle, styles.infoTitleMedia)}>
                <Localize>Media</Localize>
            </p>
            <List
                className={styles.mediaList}
                data={mediaData}
                keyExtractor={keyExtractor}
                renderItem={renderMedia}
                FooterComponent={MediaCount}
                contentContainerClassName={styles.mediaListContainer}
            />
            <ImageViewerModal
                images={allMedia ?? mediaData}
                initialIndex={initialImageIndex}
                isVisible={showImageViewer}
                onClose={handleCloseImageViewer}
            />
        </>

    );
};

const Overview = () => {
    const {modules} = useSelector(state => state.context);
    const {activeSurvey={}} = useSelector(state => state.survey);

    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [activeSeverity, setActiveSeverity] = useState('high');
    const [activeModule, setActiveModule] = useState(null);

    const handleShowSummary = useCallback((severity, module) => {
        setActiveModule(module);
        setActiveSeverity(severity);
        setShowSummaryModal(true);
    }, []);
    const handleCloseSummaryModal = useCallback(() => {
        setActiveModule(modules.find(mod => mod.code === 'sens'));
        setShowSummaryModal(false);
    }, [modules]);

    const severityCounts = useMemo(() => {
        const sensitivityModule = modules.find(mod => mod.code === 'sens');
        return getSeverityCounts(activeSurvey?.results?.filter(res => {
            return res && res.module === sensitivityModule?.id;
        }) || []);
    }, [activeSurvey, modules]);

    const renderConcernItem = useCallback(listProps => (
        <ConcernItem {...listProps} onClick={handleShowSummary} />
    ), [handleShowSummary]);

    const activityModules = useMemo(() => modules?.filter(mod => mod.code !== 'sens') || [], [modules]);

    const renderActivityModuleCard = useCallback((listProps) => (
        <ActivityModuleCard {...listProps} renderConcernItem={renderConcernItem} activeSurvey={activeSurvey} />
    ), [renderConcernItem, activeSurvey]);

    const renderSensitivityConcernItem = useCallback(listProps => {
        return renderConcernItem({...listProps, module: modules.find(mod => mod.code === 'sens')});
    }, [modules, renderConcernItem]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Overview</h2>
            <div className={styles.overview}>
                <div className={styles.overviewContent}>
                    <p className={styles.description}>
                        {getSurveyAnswerFromCode('overview')}
                    </p>
                    {activeSurvey?.answers?.length > 0 ? (
                        <div className={styles.surveyInformation}>
                            <h4 className={styles.infoHeader}><Localize>Survey Information</Localize></h4>
                            <div className={styles.infoContent}>
                                <InfoItem 
                                    title={_('Name')}
                                    value={getSurveyAnswerFromCode('nickname')} 
                                />
                                <InfoItem 
                                    title={_('Location')}
                                    value={getSurveyAnswerFromCode('place')} 
                                />
                                <InfoItem 
                                    title={_('Organization')}
                                    value={getSurveyAnswerFromCode('org') } 
                                />
                                <InfoItem 
                                    title={_('Surveyed by')}
                                    value={getSurveyAnswerFromCode('usrname')}
                                />
                                <InfoItem 
                                    title={_('Programme Scale')}
                                    value={getSurveyAnswerFromCode('scale')}
                                />
                                <InfoItem 
                                    title={_('Created on')}
                                    value={getLocaleDate(activeSurvey?.createdAt)}
                                />
                                <InfoItem 
                                    title={_('Modified on')}
                                    value={getLocaleDate(activeSurvey?.modifiedAt)}
                                />
                                <MediaItem activeSurvey={activeSurvey} />
                            </div>
                        </div>
                    ): (
                        <NeatLoader medium />
                    )}
                </div>
                <div className={styles.statementSummary}>
                    <h4 className={styles.statementTitle}>
                        <Localize>Sensitivity Statements Severity Summary</Localize>
                    </h4>
                    <List
                        className={styles.concerns}
                        data={severityCounts}
                        keyExtractor={severityExtractor}
                        renderItem={renderSensitivityConcernItem}
                    />
                    <h4 className={styles.statementTitle}><Localize>Location of Assessment</Localize></h4>
                    <div className={styles.map}>
                        <Map
                            surveyLocation={getSurveyAnswerFromCode('coords')}
                            height={275}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.activitiesSection}>
                <h4 className={styles.activitiesSectionTitle}>
                    <Localize>Activity Statements Severity Summary</Localize>
                </h4>
                <List
                    className={styles.moduleCards}
                    loading={!activeSurvey?.results?.length}
                    keyExtractor={idExtractor}
                    data={activityModules}
                    renderItem={renderActivityModuleCard}
                    LoadingComponent={
                        <span className={styles.listInfo}>
                            <Localize>Loading activity module results...</Localize>
                        </span>
                    }
                    EmptyComponent={
                        <span className={styles.listInfo}>
                            <Localize>Could not load activity module summaries</Localize>
                        </span>
                    }
                />
            </div>
            <SummaryModal 
                module={activeModule}
                isVisible={showSummaryModal} 
                onClose={handleCloseSummaryModal}
                activeSeverity={activeSeverity}
                setActiveSeverity={setActiveSeverity}
            />
        </div>
    );
};

export default Overview;

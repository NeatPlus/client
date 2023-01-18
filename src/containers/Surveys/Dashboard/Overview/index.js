import {useCallback, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {IoIosArrowRoundForward} from 'react-icons/io';

import Map from 'components/Map';
import SummaryModal from 'components/SummaryModal';
import ImageViewerModal from 'components/ImageViewerModal';

import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import Image from '@ra/components/Image';

import {_} from 'services/i18n';

import cs from '@ra/cs';
import {getSeverityCounts} from 'utils/severity';

import styles from './styles.scss';

const keyExtractor = item => item;
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

const ConcernItem = ({item, onClick}) => {
    const handleClick = useCallback(() => {
        onClick && onClick(item.severity);
    }, [item, onClick]);

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
            <p className={styles.concernLabel}>{item.severity} <Localize>Concerns</Localize></p>
            <IoIosArrowRoundForward size={24} className={styles.concernIcon} />
        </div>
    );
};

const ImageItem = ({item, index, onClick}) => {
    const handleClick = useCallback(() => onClick?.(index), [index, onClick]);

    return (
        <Image
            className={styles.mediaItem}
            src={item}
            alt={`Survey Media ${index + 1}`}
            onClick={handleClick}
        />
    );
};

const Overview = () => {
    const {modules} = useSelector(state => state.context);
    const {activeSurvey} = useSelector(state => state.survey);
    const {activeProject} = useSelector(state => state.project);

    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [activeSeverity, setActiveSeverity] = useState('high');

    const handleShowSummary = useCallback(severity => {
        setActiveSeverity(severity);
        setShowSummaryModal(true);
    }, []);
    const handleCloseSummaryModal = useCallback(() => {
        setShowSummaryModal(false);
    }, []);

    const [initialImageIndex, setInitialImageIndex] = useState(0);
    const [showImageViewer, setShowImageViewer] = useState(false);

    const handleImageClick = useCallback(index => {
        if(index > -1) {
            setInitialImageIndex(index);
        }
        setShowImageViewer(true);
    }, []);
    const handleCloseImageViewer = useCallback(() => setShowImageViewer(false), []);

    const getSurveyAnswerFromCode = useCallback((code, formatted) => {
        const answer = activeSurvey?.answers?.find(ans => ans.question.code === code)?.[formatted ? 'formattedAnswer' : 'answer'];
        if(answer) {
            return answer;
        }
        return '';
    }, [activeSurvey]);

    const severityCounts = useMemo(() => {
        const sensitivityModule = modules.find(mod => mod.code === 'sens');
        return getSeverityCounts(activeSurvey?.results?.filter(res => {
            return res && res.module === sensitivityModule?.id;
        }) || []);
    }, [activeSurvey, modules]);

    const [mediaData, moreMediaCount, allMedia] = useMemo(() => {
        let images = getSurveyAnswerFromCode('s3q2', true);
        if(images && typeof images === 'string') {
            images = [images];
        }
        if(images?.length > 5) {
            return [images.slice(0, 5), images.length - 5, images];
        }
        return [images, 0];
    }, [getSurveyAnswerFromCode]);

    const renderConcernItem = useCallback(listProps => (
        <ConcernItem {...listProps} onClick={handleShowSummary} />
    ), [handleShowSummary]);

    const renderMedia = useCallback(listProps => {
        return (
            <ImageItem {...listProps} onClick={handleImageClick} />
        );
    }, [handleImageClick]);

    const MediaCount = useMemo(() => {
        if(moreMediaCount > 0) {
            return <span className={styles.moreMediaCount} onClick={handleImageClick}>+{moreMediaCount}</span>;
        }
        return null;
    }, [moreMediaCount, handleImageClick]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Overview</h2>
            <div className={styles.overview}>
                <div className={styles.overviewContent}>
                    <p className={styles.description}>
                        {getSurveyAnswerFromCode('overview')}
                    </p>
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
                                value={getSurveyAnswerFromCode('org') || activeProject?.organizationTitle} 
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
                            {mediaData?.length > 0 && (
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
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.statementSummary}>
                    <h4 className={styles.statementTitle}>
                        <Localize>Sensitivity Statements Severity Summary</Localize>
                    </h4>
                    <List 
                        className={styles.concerns}
                        data={severityCounts}
                        keyExtractor={severityExtractor}
                        renderItem={renderConcernItem}
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
            <SummaryModal 
                isVisible={showSummaryModal} 
                onClose={handleCloseSummaryModal}
                activeSeverity={activeSeverity}
                setActiveSeverity={setActiveSeverity}
            />
        </div>
    );
};

export default Overview;

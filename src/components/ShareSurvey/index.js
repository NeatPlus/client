import {useMemo, useEffect, useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {BiDotsHorizontalRounded} from 'react-icons/bi';
import {IoMdInformationCircle} from 'react-icons/io';

import Button from 'components/Button';
import Dropdown from '@ra/components/Dropdown';
import {Localize} from '@ra/components/I18n';

import ShareImage from 'assets/images/data-sharing.svg';
import cs from '@ra/cs';
import Api from 'services/api';
import Toast from 'services/toast';
import {_} from 'services/i18n';
import usePromise from '@ra/hooks/usePromise';
import {getErrorMessage} from '@ra/utils/error';
import * as surveyActions from 'store/actions/survey';

import styles from './styles.scss';

const ShareSurvey = props => {
    const dispatch = useDispatch();
    const {activeSurvey} = useSelector(state => state.survey);

    const [linkIdentifier, setLinkIdentifier] = useState(null);

    useEffect(() => {
        if(activeSurvey?.sharedLinkIdentifier) {
            return setLinkIdentifier(activeSurvey.sharedLinkIdentifier);
        }
        setLinkIdentifier(null);
    }, [activeSurvey]);

    const [{loading: shareLoading}, getShareLink] = usePromise(Api.shareSurveyLink);
    const [{loading: unshareLoading}, unshareLink] = usePromise(Api.unshareSurveyLink);

    const isLoading = useMemo(() => shareLoading || unshareLoading, [shareLoading, unshareLoading]);

    const publicLink = useMemo(() => `${window.location.origin}/survey/${linkIdentifier}`, [linkIdentifier]);

    const handleStopPropagation = useCallback(e => e.stopPropagation(), []);

    const handleGetShareLink = useCallback(async () => {
        try {
            await getShareLink(activeSurvey?.id);
            const changedSurvey = await Api.getSurvey(activeSurvey?.id);
            dispatch(surveyActions.updateSurvey(changedSurvey));
        } catch(error) {
            Toast.show(getErrorMessage(error) || _('An error occured'), Toast.DANGER);
            console.log(error);
        }
    }, [activeSurvey, getShareLink, dispatch]);

    const handleUnshareLink = useCallback(async () => {
        try {
            await unshareLink(activeSurvey?.id);
            setLinkIdentifier(null);
            const changedSurvey = await Api.getSurvey(activeSurvey?.id);
            dispatch(surveyActions.updateSurvey(changedSurvey));
            Toast.show(_('The survey can no longer be accessed publicly'), Toast.SUCCESS);
        } catch(error) {
            Toast.show(_('An error occured!'), Toast.DANGER);
            console.log(error);
        }
    }, [unshareLink, activeSurvey, dispatch]);

    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(publicLink);
            Toast.show(_('Link has been copied to clipboard!'), Toast.SUCCESS);
        } catch (err) {
            console.log(err);
            Toast.show(_('An error occured!'), Toast.DANGER);
        }
    }, [publicLink]);

    const renderOptionsButton = useCallback(() => {
        return (
            <BiDotsHorizontalRounded size={20} className={styles.optionsIcon} />
        );
    }, []);

    return (
        <div onClick={handleStopPropagation} className={styles.shareContent}>
            <h3 className={styles.shareTitle}>
                {linkIdentifier ? _('Share Insight') : _('Share Link')}
            </h3>
            {linkIdentifier ? (
                <>
                    <div className={styles.shareBody}>
                        <p className={cs(styles.shareInfo, styles.shareText)}>
                            <Localize>Everyone with this link can view on the Web</Localize>
                        </p>
                        <div className={styles.linkContainer}>
                            <p className={styles.linkInput}>{publicLink}</p>
                            <Dropdown 
                                className={styles.dropdownButton} 
                                labelContainerClassName={styles.optionsButtonContainer}
                                renderLabel={renderOptionsButton} 
                                align="right"
                            >
                                <div className={styles.options}>
                                    <p onClick={handleUnshareLink} className={styles.optionItem}>
                                        <Localize>Stop Sharing</Localize>
                                    </p>
                                </div>
                            </Dropdown>
                        </div>
                        <Button 
                            loading={unshareLoading}
                            outline 
                            className={styles.copyButton}
                            onClick={handleCopyLink}
                        >
                            <Localize>Copy Link</Localize>
                        </Button>
                    </div>
                    <div className={styles.shareFooter}>
                        <IoMdInformationCircle className={styles.footerIcon} />
                        <Localize>This link has been shared publicly</Localize>
                    </div>
                </>
            ) : (
                <div className={styles.shareBody}>
                    <img src={ShareImage} alt="Share" className={styles.shareImage} />
                    <p className={styles.shareInfo}>
                        <Localize>Everyone with public link can view on the Web</Localize>
                    </p>
                    <Button 
                        loading={isLoading} 
                        className={styles.button}
                        onClick={handleGetShareLink}
                    >
                        <Localize>Get Public Link</Localize>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ShareSurvey;

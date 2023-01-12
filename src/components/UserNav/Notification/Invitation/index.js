import {useCallback, useMemo} from 'react';
import {BsPersonPlusFill} from 'react-icons/bs';

import Button from 'components/Button';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import cs from '@ra/cs';
import Api from 'services/api';
import Toast from 'services/toast';
import {getErrorMessage} from '@ra/utils/error';

import usePromise from '@ra/hooks/usePromise';

import NoNotification from '../NoNotification';

import styles from './styles.scss';

const Invitation = ({item}) => {
    const [{loading: approveLoading}, approveProject] = usePromise(Api.approveProject);
    const [{loading: rejectLoading}, rejectProject] = usePromise(Api.rejectProject);

    const handleAccept = useCallback(async () => {
        try {
            await approveProject(item.id);
            Api.getProjectInvitations();
            Toast.show(_('Project successfully approved!'), Toast.SUCCESS);
        } catch(error) {
            console.log(error);
            Toast.show(getErrorMessage(error), Toast.DANGER);
        }
    }, [item.id, approveProject]);

    const handleDecline = useCallback(async () => {
        try {
            await rejectProject(item.id);
            Api.getProjectInvitations();
            Toast.show(_('Project invitation declined!'), Toast.SUCCESS);
        } catch(error) {
            console.log(error);
            Toast.show(getErrorMessage(error), Toast.DANGER);
        }
    }, [item.id, rejectProject]);

    return (
        <div className={styles.invitation} key={item.id}>
            <div className={styles.iconContainer}>
                <BsPersonPlusFill
                    size={20}
                    className={styles.personIcon}
                />
            </div>
            <div className={styles.descriptionContainer}>
                <p className={styles.description}>
                    <Localize>Project</Localize> '{item.title}' <Localize>wants to join organization</Localize> '{item.organizationTitle}'
                </p>
                {item.status === 'pending' ? (
                    <div className={styles.buttons}>
                        <Button
                            loading={approveLoading}
                            className={styles.button}
                            type='button'
                            onClick={handleAccept}
                        >
                            <Localize>Accept</Localize>
                        </Button>
                        <Button
                            loading={rejectLoading}
                            className={styles.button}
                            type='button'
                            secondary
                            onClick={handleDecline}
                        >
                            <Localize>Decline</Localize>
                        </Button>
                    </div>
                ) : (
                    <div className={cs(styles.statusIndicator, {
                        [styles.statusIndicatorAccepted]: item.status === 'accepted',
                        [styles.statusIndicatorDeclined]: item.status === 'rejected'
                    })}>
                        {item.status === 'accepted' ? _('Accepted') : _('Declined')}
                    </div>
                )}
            </div>
        </div>
    );
};

const Invitations = ({invitations}) => {
    const keyExtractor = useCallback((item, index) => item.id, []);

    const EmptyComponent = useMemo(() => <NoNotification placeholder={_('No Invitations')} />, []);

    return (
        <List
            data={invitations}
            renderItem={Invitation}
            keyExtractor={keyExtractor}
            className={styles.container}
            EmptyComponent={EmptyComponent}
        />
    );
};

export default Invitations;

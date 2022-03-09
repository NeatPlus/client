import {useCallback, useMemo} from 'react';
import {BsPersonPlusFill} from 'react-icons/bs';

import Button from 'components/Button';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import Api from 'services/api';

import NoNotification from '../NoNotification';

import styles from './styles.scss';

const Invitation = ({item}) => {
    const handleAccept = useCallback(async () => {
        await Api.approveProject(item.id);
        await Api.getProjectInvitations();
    }, [item.id]);

    const handleDecline = useCallback(async () => {
        await Api.rejectProject(item.id);
        await Api.getProjectInvitations();
    }, [item.id]);

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
                <div className={styles.buttons}>
                    <Button
                        className={styles.button}
                        type='button'
                        onClick={handleAccept}
                    >
                        <Localize>Accept</Localize>
                    </Button>
                    <Button
                        className={styles.button}
                        type='button'
                        secondary
                        onClick={handleDecline}
                    >
                        <Localize>Decline</Localize>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Invitations = ({invitations}) => {
    const keyExtractor = useCallback((item, index) => item.id, []);

    const EmptyComponent =useMemo(() => <NoNotification placeholder={_('No Invitations')} />, []);

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

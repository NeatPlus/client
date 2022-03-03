import {useState, useCallback} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {useSelector} from 'react-redux';
import {BsPlus} from 'react-icons/bs';

import {NeatLoader} from 'components/Loader';
import Button from 'components/Button';
import JoinOrganizationModal from 'components/OrganizationModals/JoinOrganization';
import {Localize, localizeFn as _} from '@ra/components/I18n';

import noOrganizationImage from 'assets/images/no-organization.svg';
import {selectMyOrganizations} from 'store/selectors/organization';

import styles from './styles.scss';

const NoOrganization = () => {
    const [showJoinModal, setShowJoinModal] = useState(false);

    const handleShowCreateModal = useCallback(
        () => setShowJoinModal(true),
        []
    );
    const handleHideCreateModal = useCallback(
        () => setShowJoinModal(false),
        []
    );

    return (
        <div className={styles.container}>
            <main className={styles.content}>
                <div className={styles.createBox}>
                    <img
                        src={noOrganizationImage}
                        alt={_('No Organizations')}
                        className={styles.infoImage}
                    />
                    <p className={styles.infoText}>
                        <Localize>You haven't been added to any organization</Localize>
                    </p>
                    <Button
                        className={styles.button}
                        onClick={handleShowCreateModal}
                    >
                        <BsPlus size={24} className={styles.buttonIcon} />
                        <Localize>Join Organization</Localize>
                    </Button>
                </div>
            </main>
            <JoinOrganizationModal
                isVisible={showJoinModal}
                onClose={handleHideCreateModal}
            />
        </div>
    );
};

export default NoOrganization;

export const withNoOrganization = (WrappedComponent) => {
    const WithNoOrganization = (props) => {
        const {status} = useSelector(state => state.organization);
        const myOrganizations = useSelector(selectMyOrganizations);
        if (myOrganizations.length) {
            return <WrappedComponent {...props} />;
        }
        if (status!=='complete') {
            return <NeatLoader />;
        }
        return <NoOrganization />;
    };
    return hoistNonReactStatics(WithNoOrganization, WrappedComponent);
};

import {useState, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {BiChevronLeft} from 'react-icons/bi';
import {BsPlus} from 'react-icons/bs';

import {withNoOrganization} from 'components/NoOrganization';
import JoinOrganizationModal from 'components/OrganizationModals/JoinOrganization';
import UserNav from 'components/UserNav';
import Button from 'components/Button';
import List from '@ra/components/List';
import {Localize} from '@ra/components/I18n';

import {selectMyOrganizations} from 'store/selectors/organization';

import OrganizationCard from './OrganizationCard';
import styles from './styles.scss';

const keyExtractor = item => item.id;

const OrganizationsContent = withNoOrganization(() => {
    const myOrganizations = useSelector(selectMyOrganizations);

    return (
        <List
            data={myOrganizations}
            className={styles.organizations}
            keyExtractor={keyExtractor}
            renderItem={OrganizationCard}
        />
    );
});

const Organizations = () => {
    const myOrganizations = useSelector(selectMyOrganizations);

    const history = useHistory();

    const [showJoinModal, setShowJoinModal] = useState(false);

    const handleShowJoinModal = useCallback(() => {
        setShowJoinModal(true);
    }, []);
    const hideJoinModal = useCallback(() => {
        setShowJoinModal(false);
    }, []);

    return (
        <div className={styles.container}>
            <UserNav />
            <div className={styles.content}>
                <div onClick={history.goBack} className={styles.backLink}>
                    <BiChevronLeft size={22} className={styles.backIcon} /> <Localize>BACK</Localize>
                </div>
                <header className={styles.header}>
                    <h1 className={styles.title}><Localize>My Organizations</Localize></h1>
                    {!!myOrganizations.length && (
                        <Button 
                            outline 
                            onClick={handleShowJoinModal} 
                            className={styles.button}
                        >
                            <BsPlus size={24} className={styles.buttonIcon} />
                            <Localize>Join</Localize>
                        </Button>
                    )}
                </header>
                <OrganizationsContent />
            </div>
            <JoinOrganizationModal
                isVisible={showJoinModal}
                onClose={hideJoinModal}
            />
        </div>
    );
};

export default Organizations;

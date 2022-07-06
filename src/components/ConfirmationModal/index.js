import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import {Localize} from '@ra/components/I18n';

import {_} from 'services/i18n';
import {transformToElement} from '@ra/utils';
import confirmImg from 'assets/images/completed-task.svg';

import styles from './styles.scss';

const ConfirmationModal = (props) => {
    const {
        onClose,
        onConfirm,
        titleText,
        DescriptionComponent,
        confirmButtonText,
        cancelButtonText,
        confirmButtonProps,
        ...modalProps
    } = props;
    
    return (
        <Modal className={styles.modal} {...modalProps}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {titleText || _('Are you sure?')}
                </h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.contentMain}>
                    <img
                        className={styles.image}
                        src={confirmImg}
                        alt={_('Confirm action')}
                    />
                    <p className={styles.description}>
                        {DescriptionComponent
                            ? transformToElement(DescriptionComponent)
                            : <Localize>Please confirm that you want to carry out this action.</Localize>
                        }
                    </p>
                </div>
                <div className={styles.buttons}>
                    <Button onClick={onClose} type='button' secondary>
                        {cancelButtonText || _('Cancel')}
                    </Button>
                    <Button onClick={onConfirm} {...confirmButtonProps}>
                        {confirmButtonText || _('Confirm')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;

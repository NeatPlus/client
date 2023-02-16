import {useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {MdClose} from 'react-icons/md';

import Button from 'components/Button';
import Modal from '@ra/components/Modal';
import {Localize} from '@ra/components/I18n';

import trash from 'assets/images/trash.png';
import {initDraftAnswers} from 'utils/dispatch';
import * as questionActions from 'store/actions/question';

import styles from './styles.scss';

const DeleteDraftModal = (props) => {
    const {isVisible, onClose, onDelete, onResume, module} = props;

    const dispatch = useDispatch();

    const {modules} = useSelector(state => state.context);
    const {title, moduleCode, draftAnswers} = useSelector(state => state.draft);

    const newModuleTitle = useMemo(() => modules.find(mod => mod.code === module)?.title, [module, modules]);
    const draftModuleTitle = useMemo(() => modules.find(mod => mod.code === moduleCode)?.title, [moduleCode, modules]);

    const handleDeleteDraft = useCallback(async () => {
        initDraftAnswers();
        onClose && onClose();
        onDelete && onDelete();
    }, [onClose, onDelete]);

    const handleResumeDraft = useCallback(() => {
        dispatch(questionActions.setAnswers(draftAnswers));
        onResume(false);
    }, [dispatch, draftAnswers, onResume]);

    if (!isVisible) {
        return null;
    }

    return (
        <Modal className={styles.modal}>
            <div className={styles.header}>
                <h2 className={styles.title}><Localize>Draft survey actions</Localize></h2>
                <div className={styles.closeContainer} onClick={onClose}>
                    <MdClose size={20} className={styles.closeIcon} />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.deleteContent}>
                    <img
                        className={styles.deleteImage}
                        src={trash}
                        alt='trash bin'
                    />
                    <p className={styles.deleteText}>
                        <Localize
                            text="Starting a new {{ newModule; }} module survey will delete the draft survey '{{ draftTitle; }}' you have under the {{ draftModule; }} module. Please choose your action for the draft survey."
                            newModule={<span>{newModuleTitle || ''}</span>}
                            draftTitle={<span>{title}</span>}
                            draftModule={<span>{draftModuleTitle || ''}</span>}
                        />
                    </p>
                </div>
                <div className={styles.buttons}>
                    <Button onClick={onClose} type='button' secondary outline className={styles.cancelButton}>
                        <Localize>Cancel</Localize>
                    </Button>
                    {onResume && (
                        <Button onClick={handleResumeDraft} type='button' outline>
                            <Localize>Resume draft</Localize>
                        </Button>
                    )}
                    <Button onClick={handleDeleteDraft}>
                        <Localize>Delete draft and continue</Localize>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteDraftModal;

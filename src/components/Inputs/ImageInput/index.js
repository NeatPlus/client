import {useCallback, useRef, useMemo} from 'react';
import {IoClose} from 'react-icons/io5';
import {BsCloudUpload} from 'react-icons/bs';

import Loader from 'components/Loader';
import DragDropFileInput from '@ra/components/Form/DragDropFileInput';
import List from '@ra/components/List';

import cs from '@ra/cs';
import Toast from 'services/toast';
import useRequest from 'hooks/useRequest';

import styles from './styles.scss';

const ImagePreview = ({item, index, onRemove, disabled}) => {
    const handleClick = useCallback(() => onRemove(index), [onRemove, index]);

    return (
        <div className={cs(styles.imageContainer, {
            [styles.imageContainerDisabled]: disabled,
        })}>
            <div className={styles.removeIconContainer} onClick={handleClick}>
                <IoClose className={styles.removeIcon} />
            </div>
            <img src={item} alt={`upload-${index}`} className={styles.image} />
        </div>
    );
};

const ImageInput = ({
    answer: imageNames, 
    formattedAnswer: images = [], 
    onChange, 
    disabled, 
    multiple
}) => {
    const formRef = useRef();

    const [{loading}, uploadImage] = useRequest('/user/upload_image/', {
        method: 'POST',
        headers: new Headers(),
    });

    const answer = useMemo(() => imageNames?.split(',') ?? [], [imageNames]);

    const handleChange = useCallback(async ({files, rejections}) => {
        if(!files?.length) {
            if(rejections?.length) {
                Toast.show(rejections[0].errors?.[0].message || 'File is invalid', Toast.DANGER);
            }
            return;
        }
        const newAnswer = [...answer];
        const newImages = [...images];
        files.forEach(async file => {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const result = await uploadImage(formData);
                if(result) {
                    if(!multiple) {
                        onChange && onChange({
                            value: result.name, 
                            formattedValue: result.url,
                        });
                        return;
                    }
                    newAnswer.push(result.name);
                    newImages.push(result.url);
                    onChange && onChange({
                        value: newAnswer.join(','), 
                        formattedValue: newImages,
                    });
                }
            } catch(err) {
                console.log(err);
            }
        });
    }, [onChange, uploadImage, images, answer, multiple]);

    const handleClear = useCallback(() => {
        formRef.current.reset();
        return onChange && onChange({value: ''});
    }, [onChange]);

    const handleImageRemove = useCallback(imgIdx => {
        const newImages = [...images];
        newImages.splice(imgIdx, 1);
        onChange && onChange({value: newImages.join(',')});
    }, [onChange, images]);

    const renderImage = useCallback(listProps => {
        if(loading) {
            return <Loader color="#00a279" />;
        }
        return (
            <ImagePreview 
                {...listProps} 
                onRemove={handleImageRemove} 
                disabled={disabled} 
            />
        );
    }, [handleImageRemove, loading, disabled]);

    return (
        <>    
            <form ref={formRef} className={styles.input}>
                <DragDropFileInput
                    disabled={disabled}
                    multiple={multiple}
                    accept="image/*"
                    onChange={handleChange}
                    dropZoneClassName={styles.dropZone}
                    activeDropZoneClassName={styles.activeInput}
                    dragOverFrameClassName={styles.dragOverFrame}
                    DropZoneComponent={
                        <>
                            <BsCloudUpload size={36} className={styles.dropZoneIcon} />
                            <p className={styles.dropZoneText}>Drag & drop images here or click to upload</p>
                        </>
                    }
                />
                {images?.length > 0 && (
                    <List
                        className={styles.images}
                        data={multiple ? images : [images]}
                        keyExtractor={(item, index) => index}
                        renderItem={renderImage}
                    />
                )}
            </form>
            {answer && <div className={styles.clear} onClick={handleClear}>Clear</div>}
        </>
    );
};

export default ImageInput;

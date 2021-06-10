import {useCallback, useState, useMemo, useRef} from 'react';
import {MdCheckCircle} from 'react-icons/md';

import Loader from 'components/Loader';
import FileInput from '@ra/components/Form/FileInput';

import useRequest from 'hooks/useRequest';

import styles from './styles.scss';

const ImageInput = ({answer, onChange}) => {
    const formRef = useRef();

    const [imageUrl, setImageUrl] = useState(null);

    const [{loading}, uploadImage] = useRequest('/user/upload_image/', {
        method: 'POST',
        headers: new Headers(),
    });

    const handleChange = useCallback(async target => {
        const formData = new FormData();
        if(target.files && !target.files.length > 0) {
            setImageUrl(null);
            return onChange && onChange({value: ''}); 
        }
        try {
            formData.append('file', target.files[0]);
            const result = await uploadImage(formData);
            if(result) {
                setImageUrl(result.url);
                onChange && onChange({value: result.name});
            }
        } catch(err) {
            console.log(err);
        }
    }, [uploadImage, onChange]);

    const handleClear = useCallback(() => {
        setImageUrl(null);
        formRef.current.reset();
        return onChange && onChange({value: ''});
    }, [onChange]);

    const renderImage = useCallback(() => {
        if(!imageUrl) {
            return null;
        }
        return (
            <img src={imageUrl} alt={answer} className={styles.image} />
        );
    }, [imageUrl, answer]);

    const fileName = useMemo(() => {
        if(!answer) {
            return '';
        }
        const name = answer.split('/');
        return name?.[name.length - 1] || '';
    }, [answer]);

    return (
        <>    
            <form ref={formRef} className={styles.input}>
                <FileInput
                    accept="image/*"
                    onChange={handleChange}
                />
                <div className={styles.images}>
                    {loading ? <Loader color="#00a279" /> : renderImage()}
                    {!imageUrl && answer && (
                        <div className={styles.fileName}>
                            <MdCheckCircle className={styles.answerIcon} />
                            <span className={styles.answerText}>{fileName}</span>
                        </div>
                    )}
                </div>
            </form>
            {answer && <div className={styles.clear} onClick={handleClear}>Clear</div>}
        </>
    );
};

export default ImageInput;

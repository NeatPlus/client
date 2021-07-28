import NeatLoaderImage from 'assets/images/NEATLoader.svg';

import cs from '@ra/cs';

import styles from './styles.scss';

export const NeatLoader = ({
    className, 
    containerClassName, 
    medium, 
    small, 
    ...otherProps
}) => {
    return (
        <div className={cs(styles.loaderContainer, containerClassName)}>
            <img 
                className={cs(styles.loader, className, {
                    [styles.loaderMedium]: medium,
                    [styles.loaderSmall]: small,
                })} 
                src={NeatLoaderImage} 
                alt="Loading"
                {...otherProps}
            />
        </div>
    );
};

const Loader = ({color='#fff'}) => {
    return (
        <div className={styles.ldsRing}>
            <div style={{borderColor: `${color} transparent transparent transparent`}}>
            </div>
            <div style={{borderColor: `${color} transparent transparent transparent`}}>
            </div>
            <div style={{borderColor: `${color} transparent transparent transparent`}}>
            </div>
            <div style={{borderColor: `${color} transparent transparent transparent`}}>
            </div>
        </div>
    );
};

export default Loader;


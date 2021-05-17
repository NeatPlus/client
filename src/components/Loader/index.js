import styles from './styles.scss';

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


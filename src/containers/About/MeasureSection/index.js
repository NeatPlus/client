import Container from 'components/Container';
import {Localize} from '@ra/components/I18n';

import measure from 'assets/images/measure.webp';

import styles from './styles.scss';

const MeasureSection = () => {
    return (
        <div className={styles.measureContainer}>
            <Container>
                <div className={styles.measureSection}>
                    <div className={styles.measureInfo}>
                        <h2 className={styles.measureTitle}>
                            <Localize>
                                What does the NEAT+ measure?
                            </Localize>
                        </h2>
                        <p className={styles.measureDesc}>
                            <Localize>
                                The NEAT+ assists in flagging environmental issues of high, medium, and low concern based on project-level information, and provides subsequent mitigation tips for addressing these issues. It is not a carbon footprint tool and does not replace the need for a full project environmental impact assessment.
                            </Localize>
                        </p>
                    </div>
                    <div className={styles.measureImageWrapper}>
                        <img className={styles.measureImage} src={measure} alt="measure" />
                    </div>
                </div> 
            </Container>
        </div> 
    );
};

export default MeasureSection;

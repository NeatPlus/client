import programmatic from 'assets/images/programmatic.svg';
import organizational from 'assets/images/organizational.svg';
import advocacy from 'assets/images/advocacy.svg';

import styles from './styles.scss';

const ListTitle = ({title}) => {
    return (
        <li className={styles.listStyle}>
            <span className={styles.listTitle}>{title}</span>
        </li>
    );
};

const SubListTitle = ({title}) => {
    return (
        <li className={styles.sublistStyle}>
            <span className={styles.listSubtitle}>{title}</span>
        </li>
    );
};

const ResultSection = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
                How can the results of the NEAT+ be applied?  
            </h2>
            <p className={styles.sectionDesc}>
                The NEAT+ is a generic tool, designed for project-level applications across all ecosystems. Thus, the results should be discussed and contextualized to increase the relevance to your organization. Broadly, the ways that the results can be applied can be seen across three pillars:
            </p>
            <div className={styles.pillars}>
                <div className={styles.pillarsInfo}>
                    <h3 className={styles.pillarsTitle}>Programmatic Purposes</h3>
                    <ul className={styles.pillarsList}>
                        <ListTitle title="Project screening, design and proposal" />
                        <ul className={styles.pillarsList}>
                            <SubListTitle title="The results of the NEAT+ can be part of the needs assessment & analysis" />
                            <SubListTitle title="The results can be used to secure technical support and means to mitigate risks identified" />
                        </ul>
                        <ListTitle title="Project montoring and evaluation" />
                        <ListTitle title="Base for subsequent assessments and EIA" />
                    </ul>
                </div>
                <div className={styles.pillarsImageWrapper}>
                    <img className={styles.pillarsImage} src={programmatic} alt="programmatic" />
                </div>
            </div>
            <div className={styles.pillars}>
                <div className={styles.pillarsInfo}>
                    <h3 className={styles.pillarsTitle}>Organizational Purposes</h3>
                    <ul className={styles.pillarsList}>
                        <ListTitle title="Baseline for broader organizations’ mitigation plans" />
                        <ListTitle title="Audit purposes" />
                        <ListTitle title="Fundraising" />
                        <ul className={styles.pillarsList}>
                            <SubListTitle title="The results can be used to secure fundings for environmental risks" />
                        </ul>
                        <ListTitle title="Environmental baseline to compare operations on global scale" />
                    </ul>
                </div>
                <div className={styles.pillarsImageWrapper}>
                    <img className={styles.pillarsImage} src={organizational} alt="organizational" />
                </div>
            </div>
            <div className={styles.pillars}>
                <div className={styles.pillarsInfo}>
                    <h3 className={styles.pillarsTitle}>Organizational Purposes</h3>
                    <ul className={styles.pillarsList}>
                        <ListTitle title="Sensitization" />
                        <ul className={styles.pillarsList}>
                            <SubListTitle title="The NEAT+ is a tool to raise awareness on environmental risks among humanitarian workers who use the tool" />
                        </ul>
                        <ListTitle title="Communication" />
                        <ul className={styles.pillarsList}>
                            <SubListTitle title="The results can be used to promote the organizations’ green transition" />
                        </ul>
                        <ListTitle title="Advocacy" />
                        <ul className={styles.pillarsList}>
                            <SubListTitle title="The results can be used to trigger internet in environmental issues" />
                        </ul>
                    </ul>
                </div>
                <div className={styles.pillarsImageWrapper}>
                    <img className={styles.pillarsImage} src={advocacy} alt="advocacy" />
                </div>
            </div>
        </div>
    );
};

export default ResultSection;

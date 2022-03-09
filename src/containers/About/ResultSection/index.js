import Container from 'components/Container';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import programmatic from 'assets/images/programmatic.svg';
import organizational from 'assets/images/organizational.svg';
import advocacy from 'assets/images/advocacy.svg';

import styles from './styles.scss';

const ListTitle = ({title}) => {
    return (
        <li className={styles.listStyle}>
            <span className={styles.listTitle}>
                {title}
            </span>
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
            <Container jumbotron>
                <h2 className={styles.sectionTitle}>
                    <Localize>
                        How can the results of the NEAT+ be applied?
                    </Localize>
                </h2>
                <p className={styles.sectionDesc}>
                    <Localize>
                        The NEAT+ is a generic tool, designed for project-level applications across all ecosystems. Thus, the results should be discussed and contextualized to increase the relevance to your organization. Broadly, the ways that the results can be applied can be seen across three pillars:
                    </Localize>
                </p>
                <div className={styles.pillars}>
                    <div className={styles.pillarsInfo}>
                        <h3 className={styles.pillarsTitle}>
                            <Localize>Programmatic Purposes</Localize>
                        </h3>
                        <ul className={styles.pillarsList}>
                            <ListTitle title={_('Project screening, design and proposal')} />
                            <ul className={styles.pillarsList}>
                                <SubListTitle title={_('The results of the NEAT+ can be part of the needs assessment & analysis')} />
                                <SubListTitle title={_('The results can be used to secure technical support and means to mitigate risks identified')} />
                            </ul>
                            <ListTitle title={_('Project montoring and evaluation')} />
                            <ListTitle title={_('Base for subsequent assessments and EIA')} />
                        </ul>
                    </div>
                    <div className={styles.pillarsImageWrapper}>
                        <img className={styles.pillarsImage} src={programmatic} alt="programmatic" />
                    </div>
                </div>
                <div className={styles.pillars}>
                    <div className={styles.pillarsInfo}>
                        <h3 className={styles.pillarsTitle}>
                            <Localize>Organizational Purposes</Localize>
                        </h3>
                        <ul className={styles.pillarsList}>
                            <ListTitle title={_('Baseline for broader organizations’ mitigation plans')} />
                            <ListTitle title={_('Audit purposes')} />
                            <ListTitle title={_('Fundraising')} />
                            <ul className={styles.pillarsList}>
                                <SubListTitle title={_('The results can be used to secure fundings for environmental risks')} />
                            </ul>
                            <ListTitle title={_('Environmental baseline to compare operations on global scale')} />
                        </ul>
                    </div>
                    <div className={styles.pillarsImageWrapper}>
                        <img className={styles.pillarsImage} src={organizational} alt="organizational" />
                    </div>
                </div>
                <div className={styles.pillars}>
                    <div className={styles.pillarsInfo}>
                        <h3 className={styles.pillarsTitle}>
                            <Localize>Advocacy Purposes</Localize>
                        </h3>
                        <ul className={styles.pillarsList}>
                            <ListTitle title={_('Sensitization')} />
                            <ul className={styles.pillarsList}>
                                <SubListTitle title={_('The NEAT+ is a tool to raise awareness on environmental risks among humanitarian workers who use the tool')} />
                            </ul>
                            <ListTitle title={_('Communication')} />
                            <ul className={styles.pillarsList}>
                                <SubListTitle title={_('The results can be used to promote the organizations’ green transition')} />
                            </ul>
                            <ListTitle title={_('Advocacy')} />
                            <ul className={styles.pillarsList}>
                                <SubListTitle title={_('The results can be used to trigger interest in environmental issues')} />
                            </ul>
                        </ul>
                    </div>
                    <div className={styles.pillarsImageWrapper}>
                        <img className={styles.pillarsImage} src={advocacy} alt="advocacy" />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ResultSection;

import Container from 'components/Container';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import rural from 'assets/images/rural-neat.svg';
import urban from 'assets/images/urban-neat.svg';
import describeImage from 'assets/images/describe-img.svg';

import styles from './styles.scss';

const ToolCard = ({image, title, desc}) => {
    return (
        <div className={styles.toolCard}>
            <div className={styles.toolImageWrapper}>
                <img className={styles.toolImage} src={image} alt="Environment" />
            </div>
            <div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{desc}</p>
            </div>
        </div>
    );
};

const AdaptedSection = () => {
    return (
        <section className={styles.adaptedContainer}>
            <Container jumbotron>
                <div className={styles.adaptedSection}>
                    <h1 className={styles.title}><Localize>Adapted for rural and urban humanitarian contexts</Localize></h1>
                    <p className={styles.desc}>
                        <Localize>
                            The NEAT+ has been adapted to be used globally in both rural and urban environments. The tool generates a summary report providing organizations and actors with a snapshot of environmental vulnerabilities, highlighting environmental risks associated with specific activities.
                        </Localize>
                    </p>
                    <div className={styles.cardWrapper}>
                        <ToolCard
                            image={rural}
                            title={_('For rural environments')}
                            desc={_('The tool gathers data, using KoBo Toolbox (a mobile data collection application already in use by many humanitarian organizations), and produces the report in Excel. Alternatively, data can be input into Excel directly.')}
                        />
                        <ToolCard
                            image={urban}
                            title={_('For urban environments')}
                            desc={_('The tool gathers data directly through this web application and produces a report in the application, which can then be exported (using pdf).')}
                        />
                    </div>
                    <div className={styles.describedContent}>
                        <div>
                            <p className={styles.para}>
                                <Localize>As an initial rapid screening tool, the NEAT+ helps humanitarian actors determine whether a more comprehensive environmental assessment should be carried out. The tool produces results in an easy to read and understand format and does not require expertise in environmental topics. The suggested mitigations can be prioritised to strengthen projects against environmental vulnerabilities and reduce harmful project impacts on the environment.</Localize>
                            </p>
                            <p className={styles.para}>Additionally, the results can be used to start discussions, compare trends (over time or between projects), incorporated into geospatial analysis, and can be shared with donors and stakeholders for accountability and fundraising.</p>
                        </div>
                        <div>
                            <img className={styles.descImage} src={describeImage} alt="describe-img" />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default AdaptedSection;

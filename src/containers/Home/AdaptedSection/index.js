import rural from 'assets/images/rural-neat.svg';
import urban from 'assets/images/urban-neat.svg';
import describeImage from 'assets/images/describe-img.svg';

import styles from './styles.scss';

const ToolCard = ({image, title, desc}) => {
    return (
        <div className={styles.toolCard}>
            <div className={styles.toolImageWrapper}>
                <img className={styles.toolImage} src={image} alt="environment" />
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
        <section className={styles.container}>
            <h1 className={styles.title}>Adapted for rural and urban humanitarian contexts</h1>
            <p className={styles.desc}>The NEAT+ has been adapted to be used globally in both rural and urban environments. The tool generates a summary report providing organizations and actors with a snapshot of environmental vulnerabilities, highlighting environmental risks associated with specific activities.</p>
            <div className={styles.cardWrapper}>
                <ToolCard
                    image={rural}
                    title="For rural environments"
                    desc="The tool gathers data, using KoBo Toolbox (a mobile data collection application already in use by many humanitarian organizations), and produces the report in Excel. Alternatively, data can be input into Excel directly."
                />
                <ToolCard
                    image={urban}
                    title="For urban environments"
                    desc="The tool gathers data directly through this web application or KoBo Toolbox(a mobile data collection application already in use by many humanitarian organizations), and produces the report in the exportable (pdf, excel) or online form."
                />
            </div>
            <div className={styles.describedContent}>
                <div>
                    <p className={styles.para}>As an initial rapid screening tool, the NEAT+ helps humanitarian actors determine whether a more comprehensive environmental assessment should be carried out. The tool produces results in an easy to read and understand format and does not require expertise in environmental topics. The suggested mitigations can be prioritised to strengthen projects against environmental vulnerabilities and reduce harmful project impacts on the environment.</p>
                    <p className={styles.para}>Additionally, the results can be used to start discussions, compare trends (over time or between projects), incorporated into geospatial analysis, and can be shared with donors and stakeholders for accountability and fundraising.</p>
                </div>
                <div>
                    <img className={styles.descImage} src={describeImage} alt="describe-img" />
                </div>
            </div>
        </section>
    );
};

export default AdaptedSection;

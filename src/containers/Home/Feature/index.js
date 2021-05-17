import styles from './styles.scss';
import ruralEnv from 'assets/icons/rural-environment.svg';
import urbanEnv from 'assets/icons/urban-environment.svg';
import appFeatureImage from 'assets/images/app-feature.svg';

const Feature = () => {
    return (
        <section className={styles.neatFeature}>
            <div className={styles.neatFeatureInfo}>
                <div>
                    <h1 className={styles.title}>
                        Adapted for rural and urban humanitarian contexts
                    </h1>
                    <p className={styles.mainPara}>
                        The NEAT+ has been adapted to be used globally in both rural and urban environments. The tool
                        generates
                        a summary report
                        providing organizations and actors with a snapshot of environmental vulnerabilities, highlighting
                        environmental risks
                        associated with specific activities.
                    </p>
                </div>
                <div></div>
            </div>
            <div className={styles.neatFeatureCards}>
                <div className={styles.feature}>
                    <img src={ruralEnv} alt="rural icon" />

                    <div className={styles.cardBody}>

                        <h3 className={styles.cardHeading}>For rural environments</h3>
                        <p className={styles.cardText}>
                            The tool gathers data, using KoBo Toolbox (a mobile data collection application already in use by
                            many humanitarian
                            organizations), and produces the report in Excel. Alternatively, data can be input into Excel
                            directly.
                        </p>
                    </div>

                </div>

                <div className={styles.feature}>
                    <img src={urbanEnv} alt="urban icon" />
                    <div className={styles.cardBody}>

                        <h3 className={styles.cardHeading}>
                            For urban environments
                        </h3>

                        <p className={styles.cardText}>
                            The tool gathers data directly through this web application or KoBo Toolbox(a mobile data collection
                            application already
                            in use by many humanitarian organizations), and produces the report in the exportable (pdf, excel)
                            or online form.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.neatAppInfo}>
                <div>
                    <p className={styles.appInfoPara}>

                        As an initial rapid screening tool, the NEAT+ helps humanitarian actors determine whether a more
                        comprehensive
                        environmental assessment should be carried out. The tool produces results in an easy to read and
                        understand format and
                        does not require expertise in environmental topics. The suggested mitigations can be prioritised to
                        strengthen projects
                        against environmental vulnerabilities and reduce harmful project impacts on the environment.

                    </p>
                    <br />

                    <p className={styles.appInfoPara}>
                        Additionally, the results can be used to start discussions, compare trends (over time or between
                        projects), incorporated
                        into geospatial analysis, and can be shared with donors and stakeholders for accountability and
                        fundraising.

                    </p>
                </div>
                <div className={styles.visual}>
                    <img src={appFeatureImage} alt="features"></img>
                </div>



            </div>


        </section>


    );

};
export default Feature;

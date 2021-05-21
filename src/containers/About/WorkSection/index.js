import cs from '@ra/cs';

import step1 from 'assets/images/step1.webp';
import step2 from 'assets/images/step2.webp';
import step3 from 'assets/images/step3.webp';

import styles from './styles.scss';

const WorkSection = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.workTitle}>How does the NEAT+ work?</h2>
            <p className={styles.workDesc}>The NEAT+ combines contextual environmental information with site-specific data, both entered by the user. This input is assessed to generate a report which categorises environmental sensitivities into low, medium, and high levels of concern. This report provides organizations with a snapshot of local environmental vulnerabilities and highlights environmental risks associated with specific humanitarian activities. A set of humanitarian mitigation measures and suggestions for further resources, together with links to potential development opportunities, allow users to effectively prioritize areas of concern as relevant to their organization or operation.</p>
            <p className={styles.workDesc}>The NEAT+ works by collecting data through a questionnaire, answered by users who should be familiar with the project area, including the planned intervention, the local and host communities, and environmental surroundings. </p>
            <div className={styles.workNav}>
                <div className={cs(styles.navItem, styles.active)}>
                    <span className={styles.navId}>1</span>
                    <p className={styles.navTitle}>Access the NEAT+</p>
                </div>
                <div className={styles.barLine} />
                <div className={styles.navItem}>
                    <span className={styles.navId}>2</span>
                    <p className={styles.navTitle}>Complete Environmental Sensitivity Module</p>
                </div>
                <div className={styles.barLine} />
                <div className={styles.navItem}>
                    <span className={styles.navId}>3</span>
                    <p className={styles.navTitle}>Complete Activity Module(s)</p>
                </div>
            </div>
            <div className={styles.accessContent}>
                <div className={styles.accessInfo}>
                    <span className={styles.accessStep}>STEP 1</span>
                    <h2 className={styles.accessTitle}>Access the NEAT+</h2>
                    <p className={styles.accessDesc}>Decide whether you wish to use the Urban or Rural version of the NEAT+. You can decide using the “Access the NEAT+” page of this website. The analysis of the Rural NEAT+ is completely performed in Excel 2019, the files for which can be downloaded on this page. Kobo Toolbox can be optionally used to more easily collect data offline and to aggregate data at a project or organizational level. The Urban NEAT+ can be accessed directly from this site on the “Access the NEAT+” page. Currently, only the Environmental Sensitivity module is available for the U-NEAT+ users. </p>
                </div>
                <div className={styles.accessImageWrapper}>
                    <img src={step1} alt="step1" />
                </div>
            </div>
            <div className={styles.accessContent}>
                <div className={styles.accessInfo}>
                    <span className={styles.accessStep}>STEP 2</span>
                    <h2 className={styles.accessTitle}>Complete Environmental Sensitivity Module</h2>
                    <p className={styles.accessDesc}>The Environmental Sensitivity Module consists of questions about the activity area, and should take 30 minutes - 1 hour to complete. It must be completed before the Activity Modules. When completed, the ES Module generates a summary report including risks of high, medium, and low concern, humanitarian environmental mitigation tips, relevant resources and linked potential development opportunities.</p>
                </div>
                <div className={styles.accessImageWrapper}>
                    <img src={step2} alt="step2" />
                </div>
            </div>
            <div className={styles.accessContent}>
                <div className={styles.accessInfo}>
                    <span className={styles.accessStep}>STEP 3</span>
                    <h2 className={styles.accessTitle}>Complete Activity Module(s) (optional and currently only available for R-NEAT+)</h2>
                    <p className={styles.accessDesc}>Rural NEAT+ currently has activity modules for Shelter, WASH and Food Security. For Urban NEAT+ additional Livelihoods and Health activity modules are being developed. Within the Activity Modules you can select a number of mostly optional sub-modules. For example, within WASH sub-modules include latrines, water supply, and shower design. Each sub-module consists of 10-20 questions and should take the user 30 minutes - 1 hour to complete. When these are completed an Activity Impact Report is generated, which uses the output from the Environmental Sensitivity Report and the answers provided in the activity sub-modules to assess the potential environmental impacts of the activity, and suggest humanitarian environmental mitigation tips, relevant resources and potential development opportunities.</p>
                </div>
                <div className={styles.accessImageWrapper}>
                    <img src={step3} alt="step3" />
                </div>
            </div>
        </div>
    );
};

export default WorkSection;

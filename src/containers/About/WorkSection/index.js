import {useCallback} from 'react';
import {Link} from 'react-router-dom';

import Container from 'components/Container';

import Tabs, {Tab} from '@ra/components/Tabs';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';
import cs from '@ra/cs';

import step1 from 'assets/images/step1.webp';
import step2 from 'assets/images/step2.webp';
import step3 from 'assets/images/step3.webp';

import styles from './styles.scss';

const WorkSection = () => {
    const renderNavItem = useCallback(({title, index, active, onClick, ...otherProps}) => {
        return (
            <>
                {index!==0 && <div className={styles.barLine} />}
                <div className={cs(styles.navItem, {
                    [styles.active]: active,
                })}
                onClick={onClick}
                {...otherProps}
                >
                    <span className={styles.navId}>{index + 1}</span>
                    <p className={styles.navTitle}>{title}</p>
                </div>

            </>
        );
    }, []);

    return (
        <Container jumbotron>
            <div className={styles.container}>
                <h2 className={styles.workTitle}>
                    <Localize>How does the NEAT+ work?</Localize>
                </h2>
                <p className={styles.workDesc}>
                    <Localize>
                        The NEAT+ combines contextual environmental information with site-specific data, both entered by the user. This input is assessed to generate a report which categorises environmental sensitivities into low, medium, and high levels of concern. This report provides organizations with a snapshot of local environmental vulnerabilities and highlights environmental risks associated with specific humanitarian activities. A set of humanitarian mitigation measures and suggestions for further resources, together with links to potential development opportunities, allow users to effectively prioritize areas of concern as relevant to their organization or operation.
                    </Localize>
                </p>
                <p className={styles.workDesc}>
                    <Localize>A set of humanitarian mitigation measures, together with links to potential development opportunities, allow users to effectively prioritize areas of concern relevant to their organization or operation.</Localize>
                </p>
                <Tabs 
                    defaultActiveTab="step-1" 
                    headerClassName={styles.workNav}
                    mode="scroll" 
                    renderHeader={renderNavItem}
                >
                    <Tab label="step-1" title={_('Access the NEAT+')} className={styles.accessContent}>
                        <div className={styles.accessInfo}>
                            <span className={styles.accessStep}>
                                <Localize>STEP 1</Localize>
                            </span>
                            <h2 className={styles.accessTitle}>
                                <Localize>Access the NEAT+</Localize>
                            </h2>
                            <p className={styles.accessDesc}>
                                <Localize
                                    text='Decide whether you wish to use the Urban or Rural version of the NEAT+. You can decide using the "Access the NEAT+" page of this website. The analysis of the Rural NEAT+ is completely performed in Excel, the files for which can be downloaded on this page. Kobo Toolbox can be optionally used to more easily collect data offline and to aggregate data at a project or organizational level. The Urban NEAT+ can be accessed directly from this site on "{{ link:Access the NEAT+ }}".'
                                    link={<Link className={styles.links} to="/access" />}
                                />
                            </p>
                        </div>
                        <div className={styles.accessImageWrapper}>
                            <img src={step1} alt="step1" />
                        </div>
                    </Tab>
                    <Tab label="step-2" title={_('Complete Environmental Sensitivity Module')} className={styles.accessContent}>
                        <div className={styles.accessInfo}>
                            <span className={styles.accessStep}>
                                <Localize>STEP 2</Localize>
                            </span>
                            <h2 className={styles.accessTitle}>
                                <Localize>Complete Environmental Sensitivity Module</Localize>
                            </h2>
                            <p className={styles.accessDesc}>
                                <Localize>The Environmental Sensitivity Module consists of questions about the activity area, and should take 30 minutes - 1 hour to complete. It must be completed before the Activity Modules. When completed, the ES Module generates a summary report including risks of high, medium, and low concern, humanitarian environmental mitigation tips, relevant resources and linked potential development opportunities. In Urban NEAT+, the summary report is available in a summarized and detailed view.</Localize>
                            </p>
                        </div>
                        <div className={styles.accessImageWrapper}>
                            <img src={step2} alt="step2" />
                        </div>
                    </Tab>
                    <Tab label="step-3" title={_('Complete Activity Module(s)')} className={styles.accessContent}>
                        <div className={styles.accessInfo}>
                            <span className={styles.accessStep}>
                                <Localize>STEP 3</Localize>
                            </span>
                            <h2 className={styles.accessTitle}>
                                <Localize>
                                    Complete Activity Module(s) (optional)
                                </Localize>
                            </h2>
                            <p className={styles.accessDesc}>
                                <Localize>Rural and Urban NEAT+ currently have activity modules for Shelter, WASH and Food Security. Urban NEAT+ has an additional active Livelihood module, and Health and Waste activity modules are still being developed. Within the Activity Modules, you can select which optional sub-modules to complete; each sub-module consists of 10-20 questions. When these are completed, an activity summary report is generated, which uses the output from the environmental sensitivity report and the answers provided in the activity sub-modules to assess the potential environmental impacts of the activity and suggest humanitarian environmental mitigation tips, relevant resources and potential development opportunities. In the Urban NEAT+, the activity summary reports are available in a summarized and detailed view.</Localize>
                            </p>
                        </div>
                        <div className={styles.accessImageWrapper}>
                            <img src={step3} alt="step3" />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
};

export default WorkSection;

import styles from './styles.scss';
import Accordion from '../Accordion';
import usaidLogo from 'assets/images/usaid-logo.webp';
import wwfLogo from 'assets/images/wwf-logo.webp';
import uneLogo from 'assets/images/une-logo.webp';
import ochaLogo from 'assets/images/ocha-logo.webp';
import iucnLogo from 'assets/images/iucn-logo.webp';
import nrcLogo from 'assets/images/nrc-logo.webp';
import unhcrLogo from 'assets/images/unhcr-logo.webp';
import sccaLogo from 'assets/images/scca-logo.webp';
import feedbackImage from 'assets/images/feedback.svg';
const AppInfo = () => {

    const accordion = [

        {
            title: 'NEAT+ pilot test with the UN Refugee Agency (UNHCR) and the JEU in the Mantapala refugee settlement, Zambia…',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            title: 'NEAT+ Environmental scoping mission in the Bidibidi refugee',
            content: 'NEAT+ Environmental scoping mission in the Bidibidi refugee settlement, located in the West Nile Area of Uganda, conducted by the UN Environment Programme/OCHA Joint Environment Unit (JEU) and Norwegian Refugee Council (NRC). The purpose of the mission was to highlight key areas of environmental risk in the NRC West Nile programme while using, testing and promoting the NEAT+. Learn more about the key findings of the environmental scoping mission here or download the full mission report <a href="#" className={styles.accordionLink}>here</a>.'
        },
        {
            title: 'NEAT+ environmental scoping mission to Myanmar',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            title: 'NEAT+ environmental scoping mission to the UNHCR reception center',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        }
    ];


    return (
        <div>
            <section className={styles.neatApplication}>
                <div className={styles.applicationHeadline}>
                    <div >
                        <span className={styles.subHeading} >
                            NEAT+ APPLICATION
                        </span>
                        <h1 className={styles.infoTitle}>
                            Examples of the NEAT+ in action by humanitarian organizations
                        </h1>
                    </div>
                    <div></div>

                </div>

                <div className={styles.neatExamples}>
                    <div className={styles.paraGroup}>
                        <p className={styles.examplePara}>
                            The NEAT+ has been successfully used and applied by over fifteen humanitarian organizations in over
                            30 field operations
                            worldwide. With the latest update, the Rural NEAT+ will now be expanding into French- and
                            Spanish-speaking operations in
                            2021.
                        </p>

                        <p className={styles.examplePara}>
                            See examples and findings of previous NEAT+ pilots and environmental scoping missions. If you have a
                            report to submit,
                            please contact the UNEP/OCHA Joint Environment Unit (JEU) (<a className={styles.mailLink} href="mailto:ochaunep@un.org">ochaunep@un.org</a>).

                        </p>
                    </div>

                    <div>
                        <div className={styles.accordion}>
                            {accordion.map(({ title, content }) => (
                                <Accordion title={title} content={content} />
                            ))}
                        </div>

                    </div>

                </div>

            </section>

            <section className={styles.partners}>
                <center>
                    <h1 className={styles.partnerTitle}>NEAT+ was developed with the support of Joint Initiative* partners:</h1>
                </center>

                <center>
                    <picture className={styles.partnerLogoGroup}>
                        <img className={styles.partnerLogo} src={wwfLogo} alt="WWF_logo" />
                        <img className={styles.partnerLogo} src={usaidLogo} alt="USAID Logo" />
                        <img className={styles.partnerLogo} src={uneLogo} alt="UNE_logo" />
                        <img className={styles.partnerLogo} src={ochaLogo} alt="ocha_logo" />

                    </picture>

                    <picture className={styles.partnerLogoGroup}>
                        <img className={styles.partnerLogo} src={iucnLogo} alt="IUCN_logo" />
                        <img className={styles.partnerLogo} src={nrcLogo} alt="NRC_logo" />
                        <img className={styles.partnerLogo} src={unhcrLogo} alt="UNHCR_logo" />
                        <img className={styles.partnerLogo} src={sccaLogo} alt="SCCA_Logo" />

                    </picture>

                </center>
                <center className={styles.infoNote}>
                    * a multi-stakeholder project aimed at improving collaboration between environmental and humanitarian actors
                </center>

            </section>

            <section className={styles.feedback}>
                <div className={styles.feedbackText}>

                    <h1 className={styles.feedbackHeading}>
                        Share your feedback
                        with us
                    </h1>
                    <p className={styles.feedbackPara}>
                        To continuously improve the <strong> NEAT+</strong> and adapt it to user’s needs, we would like to learn
                more about your
                experience as a
                user and the context in which you used the tool in. Take 10 minutes to fill out this  <a className={styles.feedbackLink} href="#"> <strong>NEAT+ user feedback form</strong></a>. All
                responses are confidential and anonymous.
                    </p>

                    <p className={styles.feedbackPara}>
                        If you have any further questions, comment or feedback, please contact the OCHA/UNEP Joint Environment Unit
                        (JEU)(
                        <a className={styles.feedbackLink} href="mailto:ochaunep@un.org">
                            ochaunep@un.org</a>).
                    </p>
                </div>


                <img src={feedbackImage} alt="feedback background" />



            </section>
        </div>


    );
};
export default AppInfo;



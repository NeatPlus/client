import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {BsArrowRight} from 'react-icons/bs';

import Container from 'components/Container';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import FaqAccordion from 'components/FaqAccordion';
import Button from 'components/Button';
import {Localize} from '@ra/components/I18n';
import {_} from 'services/i18n';

import useRequest from 'hooks/useRequest';

import rural from 'assets/images/rural-neat.svg';
import urban from 'assets/images/urban-neat.svg';
import ruralFile from 'assets/images/rural-file.webp';
import urbanFile from 'assets/images/urban-file.webp';
import question from 'assets/images/question.svg';

import styles from './styles.scss';

const NeatCard = ({title, description, image, fileImage, buttonTitle, toDashboard}) => {
    return (
        <div className={styles.card}>
            <img src={image} className={styles.cardImage} alt="Rural Neat" />
            <h4 className={styles.cardTitle}>{title}</h4>
            <p className={styles.cardDesc}>{description}</p>
            {toDashboard ? (
                <Link to="/projects">
                    <Button className={styles.button}>{buttonTitle}<BsArrowRight className={styles.buttonIcon} /></Button>
                </Link>
            ) : (
                <a href="https://eecentre.org/resources/neat/" target="_blank" rel="noreferrer">
                    <Button className={styles.button}>{buttonTitle}<BsArrowRight className={styles.buttonIcon} /></Button>
                </a>
            )} 
            <img className={styles.fileImage} src={fileImage} alt="file-icon" />
        </div>
    );
};

const Access = () => {
    const [{data}, getData] = useRequest('/frequently-asked-question/');

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <NavBar />
                <div className={styles.hero}>
                    <Container>
                        <h5 className={styles.heroTitle}>Access the NEAT+ </h5>
                        <h1 className={styles.heroSubTitle}>Rural or Urban NEAT+?</h1>
                        <div className={styles.cardWrapper}>
                            <NeatCard
                                title={_('Rural NEAT+')}
                                description={_('Is your project taking place in a camp or rural setting? The Rural NEAT+ is available for download here in French, English, and Spanish. The zip file will contain all of the information necessary to get you started using either Excel or Kobo Toolbox to complete the analysis.')}
                                image={rural}
                                fileImage={ruralFile}
                                buttonTitle={_('Download here')}
                            />
                            <img src={question} className={styles.questionMark} alt="question-mark" />
                            <NeatCard
                                title={_('Urban NEAT+')}
                                description={_('The Urban NEAT+ has been developed to address the needs of humanitarian operations in urban settings. Currently, only the Environmental Sensitivity Survey, Mitigations and Opportunities are available for users. You can access the U-NEAT+, create an account, and share your findings all within the browser application.')}
                                image={urban}
                                fileImage={urbanFile}
                                buttonTitle={_('Access it here')}
                                toDashboard
                            />
                        </div>
                        <p className={styles.heroDesc}>
                            <Localize>
                                The NEAT+ has been designed as a simple, user-friendly method for non-environmentalists to identify environmental concerns in humanitarian operations. The language of the tool is geared towards humanitarian response and cluster coordination, including the Activity Modules: Shelter, WASH, Food Security & Livelihoods. The Environmental Sensitivity Module must be completed before the  Activity Modules. The ES module includes questions about the affected community, climate, and biodiversity. The UNEP/OCHA Joint Environment Unit has been supporting the development of the NEAT+ since its intial launch in 2018.
                            </Localize>
                        </p>
                        <p className={styles.heroDesc}>
                            <Localize>
                                The original NEAT+ was designed for camp settings, peri-urban or rural non-camp settings or informal camp settings. In 2021, based on feedback from partners and stakeholders, the NEAT+ received significant updates including an urban adaptation on a lighter, cloud-based platform. Whilst the Rural NEAT+ (R-NEAT+) uses Kobo Toolbox and Excel to complete the analysis, the Urban NEAT (U-NEAT+) can be completed entirely in the browser application. From this page, you can download the R-NEAT+ package, including all guidance documents, in English French or Spanish, or access the U-NEAT+ Environmental Sensitivity Module.
                            </Localize>
                        </p>
                    </Container>
                </div>
            </header>
            <main className={styles.faqContent}>
                <Container jumbotron>
                    <h1 className={styles.contentTitle}><Localize>FAQs</Localize></h1>
                    {data?.results.map(item =>
                        <FaqAccordion
                            key={item.id}
                            question={item.question}
                            answer={item.answer}
                        />
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default Access;

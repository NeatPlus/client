import Container from 'components/Container';

import iucn from 'assets/images/partners/iucn.webp';
import msb from 'assets/images/partners/msb.webp';
import ocha from 'assets/images/partners/ocha.webp';
import une from 'assets/images/partners/une.webp';
import unhcr from 'assets/images/partners/unhcr.webp';
import nrc from 'assets/images/partners/nrc.webp';
import usaid from 'assets/images/partners/usaid.webp';
import wwf from 'assets/images/partners/wwf.webp';

import styles from './styles.scss';

const partners = [
    {'id': 1, 'name': 'iucn', 'image': iucn},
    {'id': 2, 'name': 'msb', 'image': msb},
    {'id': 3, 'name': 'ocha', 'image': ocha},
    {'id': 4, 'name': 'une', 'image': une},
    {'id': 5, 'name': 'unhcr', 'image': unhcr},
    {'id': 6, 'name': 'nrc', 'image': nrc},
    {'id': 7, 'name': 'usaid', 'image': usaid},
    {'id': 8, 'name': 'wwf', 'image': wwf}
];

const PartnerSection = () => {
    return (
        <section className={styles.partnerContainer}>
            <Container jumbotron>
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        NEAT+ was developed with the support of
                        <a className={styles.joinLink} href="https://eecentre.org/2017/01/01/the-joint-initiative/" target="_blank" rel="noreferrer"> Joint Initiative</a>
                        * partners:
                    </h1>
                    <div className={styles.partnersWrapper}>
                        {partners.map(item =>
                            <div key={item.id} className={styles.partnerCard}>
                                <img className={styles.partnersImage} src={item.image} alt={item.title} />
                            </div>
                        )}
                    </div>
                    <span className={styles.footerText}>* a multi-stakeholder project aimed at improving collaboration between environmental and humanitarian actors</span>
                </div>
            </Container>
        </section>
    );
};

export default PartnerSection;

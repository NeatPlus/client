import CountryWorkCard from '../CountryWorkCard';
import worldMap from 'assets/images/world-map2.webp';
import refugeeSettlement from 'assets/images/refugee-settlement.webp';

import styles from './styles.scss';

const CountrySection = () => {
    return (
        <div className={styles.container}>
            <div className={styles.worldMap}>
                <div className={styles.worldMapCont}>
                    <img
                        className={styles.worldMapImage}
                        src={worldMap}
                        alt='world-map'
                    />
                </div>
            </div>
            <div className={styles.cards}>
                <CountryWorkCard
                    title='Zambia: Mantapala Refugee Settlement'
                    organizationName='UNHCR'
                    description='NEAT+ pilot test with the UN Refugee Agency (UNHCR) and the JEU in the Mantapala refugee settlement, Zambia, on the border with the Democratic Republic of Congo. The pilot test identified and synthesized multiple risks facing the settlement including those relating to specific food security, shelter and WASH activities. '
                    modalTitle='Zambia: Mantapala Refugee Settlement'
                    modalImage={refugeeSettlement}
                    modalDescription={
                        'In December 2018, NEAT+ was pilot tested with the UN Refugee Agency (UNHCR) in the Mantapala refugee settlement, Zambia, on the border with the Democratic Republic of Congo. It identified and synthesized multiple risks facing the settlement – both overall environmental sensitivities and those relating to specific food security, shelter and WASH activities. The NEAT+ team then worked with UNHCR to build on this analysis and propose mitigation measures. \n \n The test concluded that NEAT+ is straightforward to use, provides accurate and nuanced results, condenses heavy environmental guidance documents efficiently and strengthens linkages to planning cycles. NEAT+ can also act as an awareness raising tool, enables remote assistance and prioritization of technical support. It can be the first step towards bringing in non-traditional humanitarian actors to work collectively to address the risks highlighted. \n \n In this particular case, the process of testing the NEAT+ highlighted that deforestation in the area might be exacerbated by livelihood activities, including making burnt bricks. A MapX story map about the NEAT+ piloting process unfolded in Zambia can be viewed here. The UN Environment news article on the testing can also be consulted here.'
                    }
                />
                <CountryWorkCard
                    title='Uganda: Bidibidi Refugee Settlement'
                    organizationName='Norwegian Refugee Council '
                    description='This environmental scoping mission was conducted in the Bidibidi refugee settlement, located in the West Nile Area of Uganda, by the UN Environment Programme/OCHA Joint Environment Unit (JEU) and Norwegian Refugee Council (NRC). The purpose of the mission was to highlight key areas of environmental risk in the NRC West Nile programme while using, testing and promoting the NEAT+.'
                    modalTitle='Uganda: Bidibidi Refugee Settlement'
                    modalImage='No Image'
                    modalDescription='No Description'
                />
                <CountryWorkCard
                    title='Colombia: Maicao Transit Center'
                    organizationName='UNHCR'
                    description='The NEAT+ was applied in the UNHCR reception center, Centro de Atención Integral (CAI) in Maicao, northeastern Colombia. The purpose of the mission was to evaluate the effectiveness of the NEAT+ tool in a reception camp setting. Key findings include the need to increase and prioritize environmental education (waste management and lack of social cohesion), switching to green energy solutions, reducing disaster risk from flooding and soil erosion (through drainage systems as well as nature-based solutions), and enhancing the current community engagement and accountability mechanisms in place to promote social cohesion.'
                    modalTitle='Colombia: Maicao Transit Center'
                    modalImage='No Image'
                    modalDescription='No Description'
                />
                <CountryWorkCard
                    title='Myanmar: Hpa An Township '
                    organizationName='Norwegian Refugee Council '
                    description='This environmental scoping mission highlighted key areas of concern in Hpa An Township, Kayin State, in two villages of internally displaced persons (IDP). Key findings (and related recommendations) cover programmatic, strategic and external advocacy relevant recommendations. These encompass the need to prioritise disaster risk reduction interventions and education, the large gap in waste management, climate change, improving the capacity for screening environmental risks, and suggestions for the Myanmar Humanitarian Fund'
                    modalTitle='Myanmar: Hpa An Township '
                    modalImage='No Image'
                    modalDescription='No Description'
                />
            </div>
        </div>
    );
};

export default CountrySection;

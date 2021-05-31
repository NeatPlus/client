import {useCallback, useState} from 'react';
import {FiChevronRight} from 'react-icons/fi';

import cs from '@ra/cs';

import styles from './styles.scss';

const data = [
    {'id': 1, 'title': 'NEAT+ pilot test with the UN Refugee Agency (UNHCR) and the JEU in the Mantapala refugee settlement, Zambia, conducted by the UN Environment Programme/OCHA Joint Environment Unit (JEU) and Norwegian Refugee Council (NRC). The purpose of the mission was to highlight key areas of environmental risk in the NRC West Nile programme while using, testing and promoting the NEAT+. Learn more about the key findings of the environmental scoping mission here or download the full mission report here.'},
    {'id': 2, 'title': 'NEAT+ Environmental scoping mission in the Bidibidi refugee settlement, located in the West Nile Area of Uganda, conducted by the UN Environment Programme/OCHA Joint Environment Unit (JEU) and Norwegian Refugee Council (NRC). The purpose of the mission was to highlight key areas of environmental risk in the NRC West Nile programme while using, testing and promoting the NEAT+. Learn more about the key findings of the environmental scoping mission here or download the full mission report here.'},
    {'id': 3, 'title': 'NEAT+ environmental scoping mission to Myanmar the key findings of the environmental scoping mission here or download the full mission report here West Nile Area of Uganda, conducted by the UN Environment Programme/OCHA Joint Environment Unit (JEU) and Norwegian.'},
    {'id': 4, 'title': 'NEAT+ environmental scoping mission to the UNHCR reception center the latest update, the Rural NEAT+ will now be expanding into French- and Spanish-speaking operations in 2021'}
];

const ReadMore = ({ text, onClick, isOpen }) => {
    return (
        <div onClick={onClick} className={cs(styles.readText, isOpen && styles.readTextActive)}>
            <div className={styles.text}>{text}</div>
            <div className={styles.toggleIcon}>
                <FiChevronRight className={styles.icon} />
            </div>
        </div>
    );
};

const ExampleSection = () => {
    const [activeId, setActiveId] = useState(1);
    const handleToggle = useCallback((id) => {
        if(activeId === id) {
            setActiveId(null);
        } else {
            setActiveId(id);
        }
    }, [activeId]);
    return (
        <section className={styles.container}>
            <h5 className={styles.mainTitle}>NEAT+ APPLICATION</h5>
            <h1 className={styles.subTitle}>Examples of the NEAT+ in action by humanitarian organizations</h1>
            <div className={styles.infoWrapper}>
                <div>
                    <p className={styles.infoDesc}>
                        The NEAT+ has been successfully used and applied by over fifteen humanitarian organizations in over 30 field operations worldwide. With the latest update, the Rural NEAT+ will now be expanding into French- and Spanish-speaking operations in 2021.
                    </p>
                    <p className={styles.infoDesc}>
                        See examples and findings of previous NEAT+ pilots and environmental scoping missions. If you have a report to submit, please contact the UNEP/OCHA Joint Environment Unit (JEU) (ochaunep@un.org). 
                    </p>
                </div>
                <div className={styles.content}>
                    {data.map((item) =>
                        <ReadMore
                            onClick={() => handleToggle(item.id)}
                            isOpen={item.id === activeId}
                            id={item.id}
                            text={item.title}
                        />
                    )}                    
                </div>
            </div>
        </section>
    );
};

export default ExampleSection;

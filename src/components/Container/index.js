import cs from '@ra/cs';

import styles from './styles.scss';

const Container = props => {
    const {jumbotron, children} = props;
    return (
        <main className={cs(styles.container, {
            [styles.containerJumbotron]: jumbotron
        })}>
            {children}
        </main>
    );
};

export default Container;

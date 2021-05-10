import {withNoSurvey} from 'components/NoSurvey';
import styles from './styles.scss';

const SurveyDashboard = withNoSurvey(() => {
    return (
        <div class={styles.container}>
          Survey Dashboard
        </div>
    );
});

export default SurveyDashboard;

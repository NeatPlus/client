import {_} from 'services/i18n';

export const THRESHOLDS = {
    high: 0.75, 
    medium: 0.6, 
    low: 0.35,
};

const getInitialCounts = () => {
    return [
        {severity: _('High'), count: 0, color: '#fe625e'},
        {severity: _('Medium'), count: 0, color: '#f8b535'},
        {severity: _('Low'), count: 0, color: '#dBcf95'},
    ];
};

export const getSeverityFromScore = (score) => {
    return score >= THRESHOLDS.high 
        ? _('High') : score >= THRESHOLDS.medium
            ? _('Medium') : score >= THRESHOLDS.low
                ? _('Low') : null;
};

export const getColorFromScore = score => {
    return score >= THRESHOLDS.high
        ? '#fe625e' : score >= THRESHOLDS.medium
            ? '#f8b535' : '#dbcf95';
};

export const getSeverityCounts = surveyResults => {
    const initialCounts = getInitialCounts();

    return initialCounts.map(ct => ({
        ...ct,
        count: surveyResults.filter(st => st.severity === ct.severity).length,
    })); 
};

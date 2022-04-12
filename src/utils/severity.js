export const THRESHOLDS = {
    high: 0.75, 
    medium: 0.6, 
    low: 0.35,
};

const initialCounts = [
    {severity: 'High', count: 0, color: '#fe625e'},
    {severity: 'Medium', count: 0, color: '#f8b535'},
    {severity: 'Low', count: 0, color: '#dBcf95'},
];

export const getSeverityFromScore = (score) => {
    return score >= THRESHOLDS.high 
        ? 'High' : score >= THRESHOLDS.medium
            ? 'Medium' : score >= THRESHOLDS.low
                ? 'Low' : null;
};

export const getColorFromScore = score => {
    return score >= THRESHOLDS.high
        ? '#fe625e' : score >= THRESHOLDS.medium
            ? '#f8b535' : '#dbcf95';
};

export const getSeverityCounts = surveyResults => {
    return initialCounts.map(ct => ({
        ...ct,
        count: surveyResults.filter(st => st.severity === ct.severity).length,
    })); 
};

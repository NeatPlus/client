import {useCallback, useMemo} from 'react';
import {
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    Legend, 
    Label, 
    Tooltip,
} from 'recharts';

import styles from './styles.scss';

const COLORS = ['#fe625e', '#f8b535', '#f8e9a1'];

const initialData = [
    { name: 'High Concern', accessor: 'highCount', value: 0},
    { name: 'Medium Concern', accessor: 'mediumCount', value: 0},
    { name: 'Low Concern', accessor: 'lowCount', value: 0},
];

const LabelContent = ({viewBox, data}) => {
    const {cx, cy, innerRadius} = viewBox;

    const numHighConcerns = useMemo(() => 
        data.find(d => d.accessor === 'highCount')?.value || 0,
    [data]);

    const percentage = useMemo(() => {
        const numTotalConcerns = data.reduce((acc, d) => acc + d.value, 0);
        return parseInt((numHighConcerns / numTotalConcerns) * 100, 10);
    }, [data, numHighConcerns]);

    return (
        <g>
            <text x={5} y={cy} className={styles.descriptionValue} fill="#292929" textAnchor="left" dominantBaseline="left">{numHighConcerns}</text>
            <text x={5} y={cy+20} className={styles.descriptionText} fill="#292929" textAnchor="left" dominantBaseline="left">High Concerns</text>
            <text x={cx} y={cy-innerRadius/4} className={styles.labelPercent} fill="#292929" textAnchor="middle" dominantBaseline="middle">
                {percentage}%
            </text>
            <text x={cx} y={cy+12} className={styles.labelText} fill="#292929" textAnchor="middle" dominantBaseline="middle">
                High
            </text>
            <text x={cx} y={cy+28} className={styles.labelText} fill="#292929" textAnchor="middle" dominantBaseline="middle">
                Concern
            </text> 
        </g>
    ); 
};

const ConcernsChart = ({concerns}) => {
    const data = useMemo(() => {
        return initialData.map(d => ({...d, value: concerns.reduce((acc, cur) => acc + cur[d.accessor], 0)}));
    }, [concerns]);

    const renderLegend = useCallback(({payload}) => {
        return (
            <ul className={styles.legend}>
                {payload.map((entry, index) => (
                    <li key={`legend-item-${index}`} className={styles.legendItem}>
                        <div className={styles.legendBox} style={{backgroundColor: entry.color}} />
                        {entry.value}
                    </li>
                ))}
            </ul>
        );
    }, []);

    const renderTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltipLabel}>{`${payload[0].name}s : ${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={270}>
            <PieChart>
                <Pie
                    data={data}
                    cx="80%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="70%"
                    dataKey="value"
                >
                    {
                        data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]} 
                            />
                        ))
                    }
                    <Label content={<LabelContent data={data} />} /> 
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend content={renderLegend} verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ConcernsChart;

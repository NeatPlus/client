import {useCallback} from 'react';
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

// FIXME: Use actual Data
const DATA = [
    { name: 'High Concern', value: 165},
    { name: 'Medium Concern', value: 140 },
    { name: 'Low Concern', value: 120},
];

const ConcernsChart = () => {
    const renderLabelContent = useCallback(({viewBox}) => {
        const {cx, cy, innerRadius} = viewBox;

        return (
            <g>
                <text x={5} y={cy} className={styles.descriptionValue} fill="#292929" textAnchor="left" dominantBaseline="left">165</text>
                <text x={5} y={cy+20} className={styles.descriptionText} fill="#292929" textAnchor="left"dominantBaseline="left">High Concerns</text>
                <text x={cx} y={cy-innerRadius/4} className={styles.labelPercent} fill="#292929" textAnchor="middle" dominantBaseline="middle">
                    40%
                </text>
                <text x={cx} y={cy+12} className={styles.labelText} fill="#292929" textAnchor="middle" dominantBaseline="middle">
                    High
                </text>
                <text x={cx} y={cy+28} className={styles.labelText} fill="#292929" textAnchor="middle" dominantBaseline="middle">
                    Concern
                </text> 
            </g>
        );
    }, []);

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
                    data={DATA}
                    cx="80%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="70%"
                    dataKey="value"
                >
                    {
                        DATA.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]} 
                            />
                        ))
                    }
                    <Label content={renderLabelContent} /> 
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend content={renderLegend} verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ConcernsChart;

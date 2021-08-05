import React from 'react';
import {PieChart, Pie, Cell} from 'recharts';

const ConcernCounter = ({color, dataItem, totalCount}) => {
    const data = [dataItem, {severity: 'Other', count: totalCount - dataItem.count}];

    const COLORS = [dataItem.color, '#f2f2f2'];

    return (
        <PieChart width={24} height={24}>
            <Pie 
                stroke="none" 
                data={data} 
                color="#f2f2f2" 
                dataKey="count" 
                nameKey="severity" 
                cx="50%" 
                cy="50%" 
                outerRadius={12} 
                fill="#8884d8"
                startAngle={90}
                endAngle={-270}
            >
                {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                    />
                ))}
            </Pie>
        </PieChart>
    );
};

export default ConcernCounter;

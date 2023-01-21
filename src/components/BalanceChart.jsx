import React from 'react'

import {
    AreaChart,
    Area,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

function BalanceChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="99.9%">
            <AreaChart data={data} >
                <CartesianGrid strokeDasharray="3 3" />
                <Area type="monotone" dataKey="balance" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default BalanceChart;
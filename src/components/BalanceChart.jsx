import React from 'react'

import {
    CartesianGrid,
    ResponsiveContainer,
    Line,
    LineChart,
} from "recharts";

function BalanceChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="99.9%">
            <LineChart data={data} >
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" />
            </LineChart >
        </ResponsiveContainer>
    );
}

export default BalanceChart;
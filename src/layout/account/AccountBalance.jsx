import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';


const chartData = [
    {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400
    },
    {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210
    },
    {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290
    },
    {
        name: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000
    },
    {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181
    },
    {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500
    },
    {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100
    }
];

function AccountBalance({ accountId, balance }) {
    return (
        <div className='w-full h-full p-4 flex flex-col justify-between rounded-lg bg-gray-200'>

            {
                accountId !== null
                    ? <h3 className='flex justify-between items-end text-md'>
                        <span className='font-bold'>Balance</span>
                        <span>{balance} ETH</span>
                    </h3>
                    : null
            }
            <div className="chart aspect-video">
                <ResponsiveContainer width="100%" height="99.9%">
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default AccountBalance;
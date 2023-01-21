import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import BalanceChart from '../../components/BalanceChart';



function AccountBalance({ accountId, balance, chartData }) {
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
                <BalanceChart data={chartData} />
            </div>
        </div>
    );
}

export default AccountBalance;
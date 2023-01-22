import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import BalanceChart from '../../components/BalanceChart';



function AccountBalance({ accountId, balance, chartData }) {
    return (
        <>

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
        </>
    );
}

export default AccountBalance;
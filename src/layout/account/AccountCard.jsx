import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import {
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import Web3Context from '../../context/Web3Context';

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

function AccountCard({ accountId }) {
    const { web3, contract } = useContext(Web3Context);

    const getBalance = async () => {
        if (web3) {
            const balance = await contract.getBalance(accountId.toString());
            return balance.toNumber();
        }

        return 0;
    }

    const { data } = useQuery('accountBalance', getBalance, { initialData: 0 });
    return (
        <div className="account-btn w-full h-full p-4 flex flex-col justify-between rounded-lg aspect-square bg-gray-200">
            <div className="account-summary flex flex-col justify-between gap-4">
                {
                    accountId !== null
                        ? <h1 className='flex justify-between items-end'>
                            <span className='font-bold text-4xl'>{accountId}</span>
                            <span className='text-xl'>{data} ETH</span>
                        </h1>
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
            <Link to={`accounts/${accountId}`} className="text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Select account</Link>
        </div>
    );
}

export default AccountCard;
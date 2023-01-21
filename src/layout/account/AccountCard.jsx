import { ethers } from 'ethers';
import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import {
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";

import Web3Context from '../../context/Web3Context';

function AccountCard({ accountId }) {
    const { web3, contract } = useContext(Web3Context);

    const getBalance = async () => {
        if (web3) {
            const balance = await contract.getBalance(accountId.toString());
            return ethers.utils.formatEther(balance.toString());
        }

        return 0;
    }

    const getAccountStats = async () => {
        if (!web3) return [];

        const depositsFilter = contract.filters.Deposit(null, accountId);
        const deposits = contract
            .queryFilter(depositsFilter, -10, "latest")


        const withdrawalsFilter = contract.filters.Withdraw(null, accountId);
        const withdrawals = contract
            .queryFilter(withdrawalsFilter, -10, "latest");

        return Promise
            .all([deposits, withdrawals])
            .then((events) => {
                let chartData = [];

                let balance = 0;
                const tickData = {
                    name: "Creation",
                    amount: 0,
                    balance: 0,
                };
                chartData.push(tickData);

                events
                    .flatMap(array => array)
                    .sort((a, b) => a.args.timestamp - b.args.timestamp)
                    .forEach(e => {
                        if (e.event === "Deposit") {
                            const amount = ethers.utils.formatEther(e.args.amount.toString());
                            balance += Number.parseFloat(amount);

                            const tickData = {
                                name: "Deposit",
                                amount: amount,
                                balance: balance,
                            };

                            chartData.push(tickData);
                        } else if (e.event === "Withdraw") {
                            const amount = ethers.utils.formatEther(e.args.amount.toString());
                            balance -= Number.parseFloat(amount);

                            const tickData = {
                                name: "Withdraw ",
                                amount: amount,
                                balance: balance,
                            };

                            chartData.push(tickData);
                        }
                    });

                return (chartData.length >= 10) ? chartData.slice(-10) : chartData;
            });
    }

    const balanceQuery = useQuery('accountBalance_' + accountId, getBalance, { initialData: 0 });
    const statsQuery = useQuery('accountStats_' + accountId, getAccountStats);

    return (
        <div className="account-btn w-full h-full p-4 flex flex-col justify-between rounded-lg aspect-square bg-gray-200">
            <div className="account-summary flex flex-col justify-between gap-4">
                {
                    accountId !== null
                        ? <h1 className='flex justify-between items-end'>
                            <span className='font-bold text-4xl'>{accountId}</span>
                            <span className='text-xl'>{balanceQuery.data} ETH</span>
                        </h1>
                        : null
                }
                <div className="chart aspect-video">
                    <ResponsiveContainer width="100%" height="99.9%">
                        <AreaChart data={statsQuery.data} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <Area type="monotone" dataKey="balance" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <Link to={`accounts/${accountId}`} className="text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Select account</Link>
        </div>
    );
}

export default AccountCard;
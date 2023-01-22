import React from 'react';
import { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import TextButton from '../../components/TextButton';

function WithdrawalRequestsList({ approvalHandler, withdrawalHandler, userId, requests }) {
    const [isWaiting, setIsWaiting] = useState([]);

    const applyAction = async (requestId, handler) => {
        setIsWaiting([...isWaiting, requestId]);
        await handler(requestId);
        const index = isWaiting.indexOf(requestId);
        isWaiting.splice(index, 1);
        setIsWaiting([...isWaiting]);
    }

    const onApproval = async (requestId) => {
        await applyAction(requestId, approvalHandler);
    };

    const onWithdrawal = async (requestId) => {
        await applyAction(requestId, withdrawalHandler);
    };

    const getDate = (timestamp) => {
        const dateFormat = new Date(Number.parseInt(timestamp) * 1000);
        const dd = dateFormat.getDate().toString().padStart(2, 0);
        const mm = (dateFormat.getMonth() + 1).toString().padStart(2, 0);
        const yyyy = dateFormat.getFullYear();
        const hours = dateFormat.getHours().toString().padStart(2, 0);
        const minutes = dateFormat.getMinutes().toString().padStart(2, 0);
        const seconds = dateFormat.getSeconds().toString().padStart(2, 0);
        const date = `${dd}/${mm}/${yyyy} ${hours}:${minutes}:${seconds}`;
        return date;
    };

    return (
        <div>
            <h2 className='mb-4 text-2xl'>Withdrawal Requests</h2>

            <div className="hidden lg:block relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Requested By
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amount
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            requests.length == 0
                                ?
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">No Withdrawal Requests</td>
                                </tr>
                                : requests.map(
                                    (tx, id) => {
                                        return (
                                            <tr key={id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {getDate(tx.timestamp)}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {tx.user}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tx.amount} ETH
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tx.approved ? 'Approved' : 'Pending'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {
                                                        (userId === tx.user)
                                                            ? (tx.approved)
                                                                ? <TextButton disabled={isWaiting.includes(tx.id)} onClick={() => onWithdrawal(tx.id)} className="text-red-600 dark:text-red-500">
                                                                    {
                                                                        isWaiting.includes(tx.id) ? <LoadingSpinner /> : "Withdraw"
                                                                    }
                                                                </TextButton>
                                                                : null
                                                            : (!tx.approved)
                                                                ? tx.approvedBy.includes(userId)
                                                                    ? <TextButton disabled={true} className="text-green-600 dark:text-green-500">Approved</TextButton>
                                                                    : <TextButton disabled={isWaiting.includes(tx.id)} onClick={() => onApproval(tx.id)} className="text-blue-600 dark:text-blue-500">
                                                                        {
                                                                            isWaiting.includes(tx.id) ? <LoadingSpinner /> : "Approve"
                                                                        }
                                                                    </TextButton>
                                                                : <TextButton disabled={true} className="text-green-600 dark:text-green-500" >Approved</TextButton>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                        }

                    </tbody>
                </table>
            </div>
            <ol className="lg:hidden relative border-l border-gray-200 dark:border-gray-700">
                {
                    requests.length == 0
                        ?
                        <li className="mb-10 ml-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                            <p class="text-base text-gray-900 dark:text-white">No Transactions</p>
                        </li>
                        : requests.map(
                            (tx, id) => {

                                return (
                                    <li key={id} className="mb-10 ml-4">
                                        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{getDate(tx.timestamp)}</time>
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{tx.approved ? 'Approved' : 'Pending'}</h3>
                                        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                            {tx.amount} ETH requested by {tx.user}
                                        </p>
                                        {
                                            (userId === tx.user)
                                                ? (tx.approved)
                                                    ? <TextButton disabled={isWaiting.includes(tx.id)} onClick={() => onWithdrawal(tx.id)} className="text-red-600 dark:text-red-500">
                                                        {
                                                            isWaiting.includes(tx.id) ? <LoadingSpinner /> : "Withdraw"
                                                        }
                                                    </TextButton>
                                                    : null
                                                : (!tx.approved)
                                                    ? tx.approvedBy.includes(userId)
                                                        ? <TextButton disabled={true} className="text-green-600 dark:text-green-500">Approved</TextButton>
                                                        : <TextButton disabled={isWaiting.includes(tx.id)} onClick={() => onApproval(tx.id)} className="text-blue-600 dark:text-blue-500">
                                                            {
                                                                isWaiting.includes(tx.id) ? <LoadingSpinner /> : "Approve"
                                                            }
                                                        </TextButton>
                                                    : <TextButton disabled={true} className="text-green-600 dark:text-green-500" >Approved</TextButton>
                                        }
                                    </li>
                                );
                            }
                        )
                }
            </ol>

        </div>
    );
}

export default WithdrawalRequestsList;
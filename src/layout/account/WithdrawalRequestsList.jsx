import React from 'react';

function WithdrawalRequestsList({ approvalHandler, withdrawalHandler, userId, requests }) {

    const onApproval = async (requestId) => {
        if (await approvalHandler(requestId)) {
            console.log("Request Approved");
        }
    };

    return (
        <div>
            <h2 className='mb-4 text-2xl'>Withdrawal Requests</h2>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                        const timestamp = Number.parseInt(tx.timestamp);
                                        const dateFormat = new Date(timestamp * 1000);
                                        const dd = dateFormat.getDate().toString().padStart(2, 0);
                                        const mm = (dateFormat.getMonth() + 1).toString().padStart(2, 0);
                                        const yyyy = dateFormat.getFullYear();
                                        const hours = dateFormat.getHours().toString().padStart(2, 0);
                                        const minutes = dateFormat.getMinutes().toString().padStart(2, 0);
                                        const seconds = dateFormat.getSeconds().toString().padStart(2, 0);
                                        const date = `${dd}/${mm}/${yyyy} ${hours}:${minutes}:${seconds}`;
                                        return (
                                            <tr key={id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {date}
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
                                                                ? <button onClick={() => withdrawalHandler(tx.id)} className="font-medium uppercase text-red-600 dark:text-red-500 hover:underline">Withdraw</button>
                                                                : null
                                                            : (!tx.approved)
                                                                ? tx.approvedBy.includes(userId)
                                                                    ? <p className="font-medium uppercase text-green-600 dark:text-green-500">Approved</p>
                                                                    : <button onClick={() => onApproval(tx.id)} className="font-medium uppercase text-blue-600 dark:text-blue-500 hover:underline">Approve</button>
                                                                : <p className="font-medium uppercase text-green-600 dark:text-green-500">Approved</p>
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

        </div>
    );
}

export default WithdrawalRequestsList;
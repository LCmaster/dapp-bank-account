import React from 'react';

function WithdrawalRequestsList() {
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
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                2023-01-20 18:10
                            </th>
                            <td className="px-6 py-4">
                                0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
                            </td>
                            <td className="px-6 py-4">
                                50.0 ETH
                            </td>
                            <td className="px-6 py-4">
                                Pending
                            </td>
                            <td className="px-6 py-4 text-center">
                                <a href="#" className="font-medium uppercase text-blue-600 dark:text-blue-500 hover:underline">Approve</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default WithdrawalRequestsList;
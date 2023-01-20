import React from 'react';

function TransactionList() {
    return (
        <div>
            <h2 className='mb-4 text-2xl'>Events</h2>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Event
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                2023-01-20 18:10
                            </th>
                            <td className="px-6 py-4">
                                Withdrawal of 50.0 ETH Requested by 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default TransactionList;
import React from 'react';

function TransactionList({ transactions }) {
    return (
        <div>
            <h2 className='mb-4 text-2xl'>Transactions</h2>

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
                        {
                            transactions.length == 0
                                ?
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">No Transactions</td>
                                </tr>
                                : transactions.map(
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
                                                    {tx.event}
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

export default TransactionList;
import React from 'react';

function TransactionList({ transactions }) {

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

    const formatEvent = (eventMessage) => {
        const token = eventMessage.split(" ");
        const userAddr = token[5];
        return token.slice(0, 5).join(" ") + " " + userAddr.slice(0, 8) + '...' + userAddr.slice(-6);
    };

    return (
        <div>
            <h2 className='mb-4 text-2xl'>Transactions</h2>

            <div className="hidden lg:block relative overflow-x-auto shadow-md sm:rounded-lg">
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

                                        return (
                                            <tr key={id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {getDate(tx.timestamp)}
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

            <ol className="lg:hidden relative border-l border-gray-200 dark:border-gray-700">
                {
                    transactions.length == 0
                        ?
                        <li className="mb-10 ml-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <p className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">No Transactions</p>
                        </li>
                        : transactions.map(
                            (tx, id) => {

                                return (
                                    <li key={id} className="mb-10 ml-4">
                                        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{getDate(tx.timestamp)}</time>
                                        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                            {formatEvent(tx.event)}
                                        </p>
                                    </li>
                                );
                            }
                        )
                }
            </ol>

        </div>
    );
}

export default TransactionList;
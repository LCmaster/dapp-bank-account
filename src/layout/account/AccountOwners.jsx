import React from 'react';

function AccountOwners({ owners }) {
    return (

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h2 className='mb-4 text-2xl'>Owners</h2>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Address
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        {
                            owners.map((ownersAddr, id) => (
                                <td key={id} className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    {ownersAddr}
                                </td>
                            ))
                        }
                    </tr>
                </tbody>
            </table>
        </div>

    );
}

export default AccountOwners;
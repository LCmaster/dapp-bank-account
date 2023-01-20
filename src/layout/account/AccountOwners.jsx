import React from 'react';

function AccountOwners() {
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
                        <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            0x70997970C51812dc3A010C7d01b50e0d17dc79C8
                        </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    );
}

export default AccountOwners;
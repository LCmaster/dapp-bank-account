import React, { useRef, useState } from 'react';

function WithdrawalForm({ requestHandler }) {
    const [amount, setAmount] = useState(0);
    const amountRef = useRef();

    const onFormSubmit = async () => {
        if (await requestHandler(amount)) setAmount(0);
    };

    return (
        <div className='w-full h-full p-4 flex flex-col justify-between rounded-lg bg-gray-200'>
            <h3 className='mb-4 font-bold text-md'>Request Withdrawal</h3>
            <form onSubmit={(ev) => { ev.preventDefault(); onFormSubmit(); }} className="w-full h-full flex flex-col justify-between gap-4">
                <div className="amount">
                    <div className="mb-2">
                        <label htmlFor="deposit-amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount in ETH: </label>
                        <input
                            ref={amountRef}
                            type="number"
                            placeholder="0.00"
                            className="text-right mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id='withdrawal-amount'
                            value={amount}
                            onChange={() => setAmount(amountRef.current.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Make a request</button>
            </form>
        </div>
    );
}

export default WithdrawalForm;
import React, { useRef, useState } from 'react';
import Button from '../../components/Button';

function WithdrawalForm({ requestHandler }) {
    const [isWaiting, setIsWaiting] = useState(false);
    const [amount, setAmount] = useState(0);
    const amountRef = useRef();

    const onFormSubmit = async () => {
        setIsWaiting(true);
        if (await requestHandler(amount)) {
            setIsWaiting(false);
            setAmount(0);
        } else {
            setIsWaiting(false);
        }
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
                <Button type="submit">
                    {isWaiting ? "Waiting confirmation" : "Make a request"}
                </Button>
            </form>
        </div>
    );
}

export default WithdrawalForm;
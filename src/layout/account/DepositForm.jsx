import React, { useState } from 'react';
import { useRef } from 'react';
import Button from '../../components/Button';

function DepositForm({ depositHandler }) {
    const [isWaiting, setIsWaiting] = useState(false);
    const [amount, setAmount] = useState(0);
    const amountRef = useRef();


    const onFormSubmit = async () => {
        setIsWaiting(true);
        if (await depositHandler(amount)) {
            setIsWaiting(false);
            setAmount(0);
        } else {
            setIsWaiting(false);
        }
    };

    return (
        <>
            <h3 className='mb-4 font-bold text-md'>Deposit</h3>
            <form onSubmit={(ev) => { ev.preventDefault(); onFormSubmit(); }} className="w-full h-full flex flex-col justify-between gap-4">
                <div className="amount">
                    <div className="mb-2">
                        <label htmlFor="deposit-amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount in ETH: </label>
                        <input
                            ref={amountRef}
                            type="number"
                            min={0.000000000000000001}
                            step={0.000000000000000001}
                            placeholder="0.00"
                            className="text-right mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id='deposit-amount'
                            value={amount}
                            onChange={() => setAmount(amountRef.current.value)}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isWaiting}>
                    {isWaiting ? "Waiting confirmation" : "Make a deposit"}
                </Button>
            </form>
        </>
    );
}

export default DepositForm;
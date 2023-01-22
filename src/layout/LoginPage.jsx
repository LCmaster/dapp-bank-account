import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetamaskButton from '../components/MetamaskButton';
//CONTEXTS
import Web3Context from '../context/Web3Context';

function LoginPage() {
    const { wallet, onConnectMetamask } = useContext(Web3Context);
    const navigate = useNavigate();

    const connectToMetamask = async () => {
        await onConnectMetamask();
    };

    useState(() => {
        console.log(wallet);
        if (wallet) {
            console.log("redirecting home");
            navigate("/accounts");
        }
    }, [wallet]);

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="hidden md:block w-full max-w-sm p-4 sm:p-6 md:p-8 bg-white border border-gray-200 rounded-lg shadow-md  dark:bg-gray-800 dark:border-gray-700">
                <h2 className="mb-4 text-center text-xl font-medium text-gray-900 dark:text-white">Welcome</h2>
                <div>
                    <MetamaskButton onClick={() => connectToMetamask()} disabled={wallet} type="button" className="w-full" />
                </div>
            </div>
            <div className="md:hidden w-full max-w-sm p-4 sm:p-6 md:p-8">
                <h2 className="mb-4 text-center text-xl font-medium text-gray-900 dark:text-white">Welcome</h2>
                <div>
                    <MetamaskButton onClick={() => connectToMetamask()} disabled={wallet} type="button" className="w-full" />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
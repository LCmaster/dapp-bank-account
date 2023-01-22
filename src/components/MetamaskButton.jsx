import React from 'react';
import MetamaskLogo from './MetamaskLogo';

function MetamaskButton({ className, ...rest }) {
    return (
        <button
            {...rest}
            className={`
            flex justify-center items-center
            bg-white hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white mr-2 mb-2 ${className}`}>
            <MetamaskLogo />
            Connect with MetaMask
        </button>
    );
}

export default MetamaskButton;
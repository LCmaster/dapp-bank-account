import React from 'react';
import EthereumLogo from './EthereumLogo';

function EthereumButton({ walletAddr, className, ...rest }) {
    const getAddressContent = () => {
        const address = walletAddr ? walletAddr : '0x0000000000000000000000000000000000000000';
        return address.slice(0, 8) + '...' + address.slice(-6);
    }
    return (
        <button
            {...rest}
            className={`
                bg-gray-100 hover:bg-gray-200 text-gray-900 
                focus:ring-4 focus:outline-none focus:ring-gray-100 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2
                ${className}
                `}
        >
            <EthereumLogo />
            {getAddressContent()}
        </button>
    );
}

export default EthereumButton;
import { ethers } from "ethers";
import React, { createContext, useState } from "react";

import { contract as contractInfo } from '../abi/deployment.json';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState();
    const [contract, setContract] = useState();
    const [wallet, setWallet] = useState();

    const updateWallet = (accounts) => {
        const walletAddr = ethers.utils.getAddress(accounts[0]);
        setWallet(walletAddr);
    };

    const onVerifyAccount = async (nonce, address, signature) => {
        const signerAddr = await ethers.utils.verifyMessage(nonce, signature);
        return signerAddr === address;
    };

    useState(() => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: 'eth_accounts' })
                .then((accounts) => {
                    if (accounts.length == 0) {
                        throw new Error("No account to use");
                    }
                    updateWallet(accounts);

                    return accounts[0];
                })
                .then(() => {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    setWeb3(provider);

                    return provider;
                })
                .then((provider) => {
                    const signer = provider.getSigner();
                    const bankContract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
                    setContract(bankContract);
                })
                .catch((err) => {
                    // Some unexpected error.
                    // For backwards compatibility reasons, if no accounts are available,
                    // eth_accounts will return an empty array.
                    console.error(err);
                });

            window.ethereum.on('accountsChanged', updateWallet);
            return () => {
                window.ethereum.removeListener('accountsChanged', updateWallet);
            };
        } else {
            console.error('Please install MetaMask!', error);
        }
    }, []);

    return (
        <Web3Context.Provider value={{
            web3,
            contract,
            wallet,
            onVerifyAccount
        }}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Context;
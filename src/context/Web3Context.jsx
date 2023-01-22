import { ethers } from "ethers";
import React, { createContext, useState } from "react";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState();
    const [wallet, setWallet] = useState();

    const onConnectMetamask = async () => {
        return await ethereum.request({ method: 'eth_requestAccounts' });
    }

    const updateWallet = async (accounts) => {
        console.log(accounts);
        if (accounts.length > 0) {
            const walletAddr = ethers.utils.getAddress(accounts[0]);
            if (walletAddr !== wallet) {
                setWallet(walletAddr);
            }
        } else {
            setWallet(null);
        }
    };

    const onVerifyAccount = async (nonce) => {
        const signer = web3.getSigner();
        const signature = await signer.signMessage(nonce);
        const address = await signer.getAddress();
        const signerAddr = ethers.utils.verifyMessage(nonce, signature);
        return signerAddr === address;
    };

    useState(() => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setWeb3(provider);

            window.ethereum
                .request({ method: 'eth_accounts' })
                .then(updateWallet)
                .catch((err) => {
                    console.error(err);
                });
            window.ethereum.on('accountsChanged', updateWallet);
            return () => {
                window.ethereum.removeListener('accountsChanged', updateWallet);
            };
        } catch (e) {
            console.error(e);
        }
    }, [web3, wallet]);

    return (
        <Web3Context.Provider value={{
            web3,
            wallet,
            onConnectMetamask,
            onVerifyAccount
        }}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Context;
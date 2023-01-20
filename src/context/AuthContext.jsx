import React, { createContext, useContext, useEffect, useState } from "react";
import Web3Context from "./Web3Context";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { web3, wallet, onVerifyAccount } = useContext(Web3Context);

    const onLogIn = async (nonce) => {
        const signer = web3.getSigner();
        const signature = await signer.signMessage(nonce);
        const address = await signer.getAddress();
        const isLegit = await onVerifyAccount(nonce, address, signature);

        if (isLegit) {
            setUserId(wallet);
            setIsLoggedIn(isLegit);
        }
    };
    const onLogOut = () => {
        console.log("Trying to log out!");
    };

    useEffect(() => {
        if (userId !== wallet) {
            setIsLoggedIn(false);
        }
    }, [wallet]);

    return (
        <AuthContext.Provider value={{ userId, isLoggedIn, onLogIn, onLogOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
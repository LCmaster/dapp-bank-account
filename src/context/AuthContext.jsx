import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Web3Context from "./Web3Context";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    const { web3, wallet, onVerifyAccount } = useContext(Web3Context);

    const onLogIn = async (nonce) => {
        if (web3) {
            if (await onVerifyAccount(nonce)) {
                setUserId(wallet);
                setIsLoggedIn(true);
                navigate('/');
            }
        }
    };
    const onLogOut = () => {
        setUserId(null);
        setIsLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        if (userId !== wallet) {
            setUserId(wallet);
            setIsLoggedIn(true);
            navigate('/');
            // setIsLoggedIn(false);
            // navigate('/login');
        }
    }, [wallet, userId, isLoggedIn]);

    return (
        <AuthContext.Provider value={{ userId, isLoggedIn, onLogIn, onLogOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
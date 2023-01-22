import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import Web3Context from "./Web3Context";

import { contract as contractInfo } from '../abi/deployment.json';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
    const [contract, setContract] = useState();
    const { web3, wallet } = useContext(Web3Context);

    useEffect(() => {
        if (wallet) {
            const signer = web3.getSigner();
            const bankContract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
            setContract(bankContract);
        } else {
            setContract(null);
        }
    }, [wallet]);

    return (
        <ContractContext.Provider value={{ contract }}>
            {children}
        </ContractContext.Provider>
    );
};

export default ContractContext;
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useQuery } from "react-query";
import Web3Context from "./Web3Context";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const { contract } = useContext(Web3Context);
    // const [selectedAccount, setSelectedAccount] = useState();

    const getAccounts = async () => {
        const accounts = await contract.getAccounts();
        return accounts.map((id) => id.toNumber());
    }

    const query = useQuery('accounts', getAccounts);

    // const onSelectAccount = (accountId) => {
    //     setSelectedAccount(accountId);
    // };

    const onCreateAccount = async (owners) => {
        const tx = await contract.createAccount(owners);
        await tx.wait();
        query.refetch();
    };

    return (
        <AccountContext.Provider value={{ accounts: query.data, onCreateAccount }}>
            {children}
        </AccountContext.Provider>
    );
}

export default AccountContext;
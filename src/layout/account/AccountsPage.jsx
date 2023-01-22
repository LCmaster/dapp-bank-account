import React, { useContext, useEffect } from 'react';
// CONTEXTS
import Web3Context from '../../context/Web3Context';
import AccountContext from '../../context/AccountContext';
//COMPONENTS
import AccountCard from './AccountCard';
import Card from '../../components/Card';
import CreateAccountForm from './CreateAccountForm';


function AccountsPage() {

    const { wallet } = useContext(Web3Context);
    const { contract, getAccountsQuery } = useContext(AccountContext);

    const accountsQuery = getAccountsQuery();

    const refetchOnAccountCreatedEvent = (owners, id, timestamp) => {
        if (owners.includes(wallet)) {
            accountsQuery.refetch();
        }
    };

    useEffect(() => {
        if (contract) {
            contract.on("AccountCreated", refetchOnAccountCreatedEvent);

            return () => {
                contract.off("AccountCreated", refetchOnAccountCreatedEvent);
            }
        }
    }, [contract]);

    return (
        <div className='grid grid-rows-3 grid-cols-1 gap-4 md:grid-rows-1 md:grid-cols-3'>
            {accountsQuery.data.map((accountId, id) => <AccountCard key={id} accountId={accountId} />)}
            {accountsQuery.data.length < 3 && <Card><CreateAccountForm /></Card>}
        </div>
    );
}

export default AccountsPage;
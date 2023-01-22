import React, { useContext, useEffect } from 'react';
// CONTEXTS
import AuthContext from '../../context/AuthContext';
import AccountContext from '../../context/AccountContext';
//COMPONENTS
import AccountCard from './AccountCard';
import Card from '../../components/Card';
import CreateAccountForm from './CreateAccountForm';


function AccountsPage() {

    const { userId } = useContext(AuthContext);
    const { contract, getAccountsQuery } = useContext(AccountContext);

    const accountsQuery = getAccountsQuery();

    const refetchOnAccountCreatedEvent = (owners, id, timestamp) => {
        if (owners.includes(userId)) {
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
        <div className='grid grid-cols-3 gap-4'>
            {accountsQuery.data.map((accountId, id) => <AccountCard key={id} accountId={accountId} />)}
            {accountsQuery.data.length < 3 && <Card><CreateAccountForm /></Card>}
        </div>
    );
}

export default AccountsPage;
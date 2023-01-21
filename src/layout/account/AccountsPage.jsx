import React, { useContext } from 'react';
// CONTEXTS
import AccountContext from '../../context/AccountContext';
//COMPONENTS
import AccountCard from './AccountCard';
import Card from '../../components/Card';
import CreateAccountForm from './CreateAccountForm';

function AccountsPage() {
    const { getAccountsQuery } = useContext(AccountContext);
    const accountsQuery = getAccountsQuery();

    return (
        <div className='grid grid-cols-3 gap-4'>
            {accountsQuery.data.map((accountId, id) => <AccountCard key={id} accountId={accountId} />)}
            {accountsQuery.data.length < 3 && <Card><CreateAccountForm /></Card>}
        </div>
    );
}

export default AccountsPage;
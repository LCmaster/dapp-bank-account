import React from 'react';
import { useContext } from 'react';
import AccountContext from '../../context/AccountContext';
import AccountCard from './AccountCard';
import CreateAccountForm from './CreateAccountForm';

function AccountsPage() {
    const { accounts } = useContext(AccountContext);

    return (
        <div className='grid grid-cols-3 gap-4'>
            {
                accounts
                && accounts.map(
                    (accountId, id) => <AccountCard key={id} accountId={accountId} />
                )
            }
            <div className="account-btn p-4 flex rounded-lg bg-gray-200">
                <CreateAccountForm />
            </div>
        </div>
    );
}

export default AccountsPage;
import React from 'react';
import { Link } from 'react-router-dom';

import CreateAccountForm from './CreateAccountForm';
import BankAccountButton from './BankAccountButton';

function AccountsPage({ accounts, contract }) {
  const createAccountHandler = async (owners) => {
    const tx = await contract.createAccount(owners);
    await tx.wait();
  };

  return (
    <div className="card p-4 grid grid-cols-1 gap-4 divide-y bg-gray-100">
      <ul className="accounts flex flex-col gap-2">
        {accounts
          ? accounts.map((account, id) => (
            <li key={id}>
              <Link to={`/accounts/${account}`}>
                <BankAccountButton accountId={account} />
              </Link>
            </li>
          ))
          : null
        }
      </ul>
      <CreateAccountForm onCreateAccount={createAccountHandler} />
    </div>
  );
}

export default AccountsPage;
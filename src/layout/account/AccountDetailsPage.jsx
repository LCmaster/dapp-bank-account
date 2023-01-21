import React, { useContext } from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
//CONTEXTS
import AuthContext from '../../context/AuthContext';
import AccountContext from '../../context/AccountContext';
//COMPONENTS
import DepositForm from './DepositForm';
import AccountOwners from './AccountOwners';
import AccountBalance from './AccountBalance';
import WithdrawalForm from './WithdrawalForm';
import TransactionList from './TransactionList';
import WithdrawalRequestsList from './WithdrawalRequestsList';

function AccountDetails() {
    const { accountId } = useParams();
    const { userId } = useContext(AuthContext);

    const {
        getOwnersQuery,
        getBalanceQuery,
        getStatsQuery,
        getWithdrawalRequestsQuery,
        getTransactionsQuery,
        onDeposit,
        onWithdrawalRequest,
        onWithdrawal,
        onApproveRequest
    } = useContext(AccountContext);

    const balanceQuery = getBalanceQuery(accountId);
    const ownersQuery = getOwnersQuery(accountId);
    const statsQuery = getStatsQuery(accountId);

    const withdrawalRequestsQuery = getWithdrawalRequestsQuery(accountId);
    const transactionsQuery = getTransactionsQuery(accountId);

    return (
        <div className='grid grid-flow-row auto-rows-min gap-6'>
            <div className="w-full py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <Link to={"/"} className="flex gap-2 items-center"><MdArrowBackIos /> Back</Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                    <AccountBalance accountId={accountId} balance={balanceQuery.data} chartData={statsQuery.data} />
                </div>
                <DepositForm depositHandler={(amount) => onDeposit(accountId, amount)} />
                <WithdrawalForm requestHandler={(amount) => onWithdrawalRequest(accountId, amount)} />
            </div>
            <AccountOwners owners={ownersQuery.data} />
            <WithdrawalRequestsList
                userId={userId}
                requests={withdrawalRequestsQuery.data}
                approvalHandler={(requestId) => onApproveRequest(accountId, requestId)}
                withdrawalHandler={(requestId) => onWithdrawal(accountId, requestId)}
            />
            <TransactionList transactions={transactionsQuery.data} />
        </div>
    );
}

export default AccountDetails;
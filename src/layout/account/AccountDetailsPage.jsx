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
import { useEffect } from 'react';

function AccountDetails() {
    const { accountId } = useParams();
    const { userId } = useContext(AuthContext);

    const {
        contract,
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

    const depositHandler = async (amount) => {
        try {
            await onDeposit(accountId, amount);
            balanceQuery.refetch();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };
    const withdrawalRequestHandler = async (amount) => {
        try {
            await onWithdrawalRequest(accountId, amount);
            withdrawalRequestsQuery.refetch();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };
    const approveRequestHandler = async (requestId) => {
        try {
            await onApproveRequest(accountId, requestId);
            withdrawalRequestsQuery.refetch();
        } catch (e) {
            console.error(e);
        }
    };
    const withdrawalHandler = async (requestId) => {
        try {
            await onWithdrawal(accountId, requestId);
            balanceQuery.refetch();
            transactionsQuery.refetch();
            withdrawalRequestsQuery.refetch();
        } catch (e) {
            console.error(e);
        }
    };

    const refetchOnDepositEvent = (user, account, amount, timestamp) => {
        if (account.toNumber() == accountId) {
            transactionsQuery.refetch();
            balanceQuery.refetch();
            statsQuery.refetch();
        }
    };
    const refetchOnWithdrawalRequestedEvent = (user, account, withdrawId, amount, timestamp) => {
        if (account.toNumber() == accountId) {
            withdrawalRequestsQuery.refetch();
        }
    };
    const refetchOnWithdrawalRequestApprovedEvent = (user, account, withdrawId, amount, timestamp) => {
        if (account.toNumber() == accountId) {
            withdrawalRequestsQuery.refetch();
        }
    };
    const refetchOnWithdrawalEvent = (user, account, withdrawId, amount, timestamp) => {
        if (account.toNumber() == accountId) {
            transactionsQuery.refetch();
            balanceQuery.refetch();
            statsQuery.refetch();
        }
    };


    useEffect(() => {
        if (contract) {
            contract.on("WithdrawRequestApproved", refetchOnWithdrawalRequestApprovedEvent);
            contract.on("WithdrawRequested", refetchOnWithdrawalRequestedEvent);
            contract.on("Withdraw", refetchOnWithdrawalEvent);
            contract.on("Deposit", refetchOnDepositEvent);
            return () => {
                contract.off("Deposit", refetchOnDepositEvent);
                contract.off("Withdraw", refetchOnWithdrawalEvent);
                contract.on("WithdrawRequested", refetchOnWithdrawalRequestedEvent);
                contract.on("WithdrawRequestApproved", refetchOnWithdrawalRequestApprovedEvent);
            }
        }
    }, [contract]);

    return (
        <div className='grid grid-flow-row auto-rows-min gap-6'>
            <div className="w-full py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <Link to={"/"} className="flex gap-2 items-center"><MdArrowBackIos /> Back</Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                    <AccountBalance accountId={accountId} balance={balanceQuery.data} chartData={statsQuery.data} />
                </div>
                <DepositForm depositHandler={depositHandler} />
                <WithdrawalForm requestHandler={withdrawalRequestHandler} />
            </div>
            <AccountOwners owners={ownersQuery.data} />
            <WithdrawalRequestsList
                userId={userId}
                requests={withdrawalRequestsQuery.data}
                approvalHandler={approveRequestHandler}
                withdrawalHandler={withdrawalHandler}
            />
            <TransactionList transactions={transactionsQuery.data} />
        </div>
    );
}

export default AccountDetails;
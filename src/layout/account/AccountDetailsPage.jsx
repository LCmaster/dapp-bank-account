import React from 'react';
import AccountBalance from './AccountBalance';
import DepositForm from './DepositForm';
import TransactionList from './TransactionList';
import WithdrawalForm from './WithdrawalForm';
import WithdrawalRequestsList from './WithdrawalRequestsList';

import { MdArrowBackIos } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import Web3Context from '../../context/Web3Context';
import { ethers } from 'ethers';
import AccountOwners from './AccountOwners';
import { useQuery } from 'react-query';
import AuthContext from '../../context/AuthContext';

function AccountDetails() {
    const { accountId } = useParams();

    const { contract } = useContext(Web3Context);
    const { userId } = useContext(AuthContext);

    const getBalance = async () => {
        if (web3) {
            const balance = await contract.getBalance(accountId.toString());
            return ethers.utils.formatEther(balance.toString());
        }

        return 0;
    }

    const getOwners = async () => {
        if (!contract)
            throw new Error("Smart Contract Missing");

        return await contract.getOwners(accountId);
    };

    const getWithdrawalRequests = async () => {
        if (!contract)
            throw new Error("Smart Contract Missing");
        // event WithdrawRequested(
        //     address indexed user,
        //     uint256 indexed accountId,
        //     uint256 indexed withdrawId,
        //     uint256 amount,
        //     uint256 timestamp
        // );
        const withdrawalRequestedFilter = contract.filters.WithdrawRequested(null, accountId);
        const withdrawalRequests = await contract.queryFilter(withdrawalRequestedFilter, 0, "latest");

        const pendingWithdrawalRequests = await Promise
            .all(withdrawalRequests
                .map(async (entry) => {
                    // event Withdraw(
                    //     address indexed user, 
                    //     uint256 indexed accountId, 
                    //     uint256 indexed withdrawId, 
                    //     uint256 amount, 
                    //     uint256 timestamp
                    // );
                    const withdrawalsFilter = contract.filters.Withdraw(null, accountId, entry.args.withdrawId.toString());
                    const wasWithdrawn = await contract.queryFilter(withdrawalsFilter, 0, "latest");

                    return {
                        withdrawn: wasWithdrawn.length > 0,
                        request: entry
                    }
                })
            ).then(res => res);

        const requestsThatWerentWithdrawn = pendingWithdrawalRequests.filter(entry => !entry.withdrawn).map(entry => entry.request);
        const requestWithApprovals = await Promise.all(
            requestsThatWerentWithdrawn.map(async (entry) => {
                // event WithdrawApproved(
                //     uint256 indexed accountId,
                //     uint256 indexed withdrawId,
                //     uint256 timestamp
                // );
                const withdrawalApprovedFilter = contract.filters.WithdrawApproved(accountId, entry.args.withdrawId.toString(), null);
                const isApproved = await contract.queryFilter(withdrawalApprovedFilter, 0, "latest");

                return {
                    approved: isApproved.length > 0,
                    request: entry
                }
            })
        ).then(res => res
            .sort((a, b) => a.request.args.timestamp - b.request.args.timestamp)
            .reverse()
            .map(async (entry) => {
                // event WithdrawRequestApproved(
                //     address indexed user,
                //     uint256 indexed accountId,
                //     uint256 indexed withdrawId,
                //     uint256 timestamp
                // );
                const withdrawalRequestsApprovedFilter = contract.filters.WithdrawRequestApproved(null, accountId, entry.request.args.withdrawId.toString());
                const approvalsArray = await contract
                    .queryFilter(withdrawalRequestsApprovedFilter, 0, "latest");
                console.log(approvalsArray);
                const approvals = approvalsArray.map(approvalEntry => approvalEntry.args.user);
                return {
                    id: entry.request.args.withdrawId.toNumber(),
                    timestamp: entry.request.args.timestamp.toNumber(),
                    user: entry.request.args.user,
                    amount: Number.parseFloat(ethers.utils.formatEther(entry.request.args.amount.toString())),
                    approvedBy: approvals,
                    approved: entry.approved
                };
            })
        ).then(res => res);



        return await Promise.all(requestWithApprovals);
    };

    const getTransactions = async () => {
        if (!contract)
            throw new Error("Smart Contract Missing");

        // event Deposit(
        //     address indexed user,
        //     uint256 indexed accountId,
        //     uint256 amount,
        //     uint256 timestamp
        // );
        const depositsFilter = contract.filters.Deposit(null, accountId);
        const deposits = contract
            .queryFilter(depositsFilter, -10, "latest");

        // event Withdraw(
        //     address indexed user, 
        //     uint256 indexed accountId, 
        //     uint256 indexed withdrawId, 
        //     uint256 amount, 
        //     uint256 timestamp
        // );
        const withdrawalsFilter = contract.filters.Withdraw(null, accountId);
        const withdrawals = contract
            .queryFilter(withdrawalsFilter, -10, "latest");

        return Promise
            .all([deposits, withdrawals])
            .then((events) => {
                return events
                    .flatMap(array => array)
                    .sort((a, b) => a.args.timestamp - b.args.timestamp)
                    .reverse()
                    .map(ev => {
                        return {
                            timestamp: ev.args.timestamp.toNumber(),
                            event: `${ev.event} of ${ethers.utils.formatEther(ev.args.amount.toString())} ETH by ${ev.args.user}`
                        }
                    });
            });
    };

    const onDeposit = async (amount) => {
        if (contract) {
            const tx = await contract.deposit("" + accountId, { value: ethers.utils.parseUnits("" + amount, "ether") });
            await tx.wait();
            return true;
        }
        return false;
    };

    const onWithdrawalRequest = async (amount) => {
        if (contract) {
            const tx = await contract.requestWithdraw("" + accountId, ethers.utils.parseUnits("" + amount, "ether"));
            await tx.wait();
            return true;
        }
        return false;
    };

    const balanceQuery = useQuery('accountBalance_' + accountId, getBalance, { initialData: 0 });
    const ownersQuery = useQuery("accountOwners_" + accountId, getOwners, { initialData: [] });
    const transactionsQuery = useQuery("accountTransactions_" + accountId, getTransactions, { initialData: [] });
    const withdrawalRequestsQuery = useQuery("accountWithdrawalRequests_" + accountId, getWithdrawalRequests, { initialData: [] });

    return (
        <div className='grid grid-flow-row auto-rows-min gap-6'>
            <div className="w-full py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <Link to={"/"} className="inline-block flex gap-2 items-center"><MdArrowBackIos /> Back</Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                    <AccountBalance accountId={accountId} balance={balanceQuery.data} />
                </div>
                <DepositForm depositHandler={onDeposit} />
                <WithdrawalForm requestHandler={onWithdrawalRequest} />
            </div>
            <AccountOwners owners={ownersQuery.data} />
            <WithdrawalRequestsList accountId={accountId} contract={contract} userId={userId} requests={withdrawalRequestsQuery.data} />
            <TransactionList transactions={transactionsQuery.data} />
        </div>
    );
}

export default AccountDetails;
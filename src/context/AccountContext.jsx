import React, { useContext, createContext } from "react";
import { ethers } from "ethers";
import { useQuery } from "react-query";
//CONTEXTS
import ContractContext from "./ContractContext";
//RESOURCES
import { contract as contractInfo } from '../abi/deployment.json';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const { contract } = useContext(ContractContext);

    const getAccounts = async () => {
        const accounts = await contract.getAccounts();
        return accounts.map((id) => id.toNumber());
    };

    const getBalance = async (accountId) => {
        const balance = await contract.getBalance(accountId.toString());
        return ethers.utils.formatEther(balance.toString());
    }

    const getOwners = async (accountId) => {
        return await contract.getOwners(accountId);
    };

    const getAccountStats = async (accountId) => {
        const depositsFilter = contract.filters.Deposit(null, accountId);
        const deposits = contract
            .queryFilter(depositsFilter, contractInfo.block, "latest")

        const withdrawalsFilter = contract.filters.Withdraw(null, accountId);
        const withdrawals = contract
            .queryFilter(withdrawalsFilter, contractInfo.block, "latest");

        return Promise
            .all([deposits, withdrawals])
            .then((events) => {
                let balance = 0;
                let data = [
                    {
                        name: "Creation",
                        amount: 0,
                        balance: 0,
                    }
                ];

                events
                    .flatMap(array => array)
                    .sort((a, b) => a.args.timestamp - b.args.timestamp)
                    .forEach(e => {
                        const amount = Number.parseFloat(ethers.utils.formatEther(e.args.amount.toString()));
                        balance += (e.event === "Deposit") ? amount : -amount;

                        data.push(
                            {
                                name: e.event,
                                amount: amount,
                                balance: balance,
                            }
                        );
                    });

                return (data.length >= 10) ? data.slice(-10) : data;
            });
    };

    const getWithdrawalRequests = async (accountId) => {
        const withdrawalRequestedFilter = contract.filters.WithdrawRequested(null, accountId);
        const withdrawalRequests = await contract.queryFilter(withdrawalRequestedFilter, contractInfo.block, "latest");

        const pendingWithdrawalRequests = await Promise
            .all(withdrawalRequests
                .map(async (entry) => {
                    const withdrawalsFilter = contract.filters.Withdraw(null, accountId, entry.args.withdrawId.toString());
                    const wasWithdrawn = await contract.queryFilter(withdrawalsFilter, contractInfo.block, "latest");

                    return {
                        withdrawn: wasWithdrawn.length > 0,
                        request: entry
                    }
                })
            );

        const requestsThatWerentWithdrawn = pendingWithdrawalRequests.filter(entry => !entry.withdrawn).map(entry => entry.request);
        const requestWithApprovals = await Promise.all(
            requestsThatWerentWithdrawn.map(async (entry) => {
                const withdrawalApprovedFilter = contract.filters.WithdrawApproved(accountId, entry.args.withdrawId.toString(), null);
                const isApproved = await contract.queryFilter(withdrawalApprovedFilter, contractInfo.block, "latest");

                return {
                    approved: isApproved.length > 0,
                    request: entry
                }
            })
        ).then(res => res
            .sort((a, b) => a.request.args.timestamp - b.request.args.timestamp)
            .reverse()
            .map(async (entry) => {
                const withdrawalRequestsApprovedFilter = contract.filters.WithdrawRequestApproved(null, accountId, entry.request.args.withdrawId.toString());
                const approvalsArray = await contract
                    .queryFilter(withdrawalRequestsApprovedFilter, contractInfo.block, "latest");

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
        );

        return await Promise.all(requestWithApprovals);
    };

    const getTransactions = async (accountId) => {
        const depositsFilter = contract.filters.Deposit(null, accountId);
        const deposits = contract
            .queryFilter(depositsFilter, contractInfo.block, "latest");

        const withdrawalsFilter = contract.filters.Withdraw(null, accountId);
        const withdrawals = contract
            .queryFilter(withdrawalsFilter, contractInfo.block, "latest");

        return Promise
            .all([deposits, withdrawals])
            .then((events) => {
                return events
                    .flatMap(array => array)
                    .sort((a, b) => a.args.timestamp - b.args.timestamp)
                    .map(ev => {
                        return {
                            timestamp: ev.args.timestamp.toNumber(),
                            event: `${ev.event} of ${ethers.utils.formatEther(ev.args.amount.toString())} ETH by ${ev.args.user}`
                        }
                    })
                    .reverse();
            })
            .then(data => data.length >= 10 ? data.slice(0, 10) : data);
    };

    const onCreateAccount = async (owners) => {
        const tx = await contract.createAccount(owners);
        return await tx.wait();
    };

    const onDeposit = async (accountId, amount) => {
        const tx = await contract.deposit("" + accountId, { value: ethers.utils.parseUnits("" + amount, "ether") });
        return await tx.wait();
    };

    const onWithdrawalRequest = async (accountId, amount) => {
        const tx = await contract.requestWithdraw("" + accountId, ethers.utils.parseUnits("" + amount, "ether"));
        return await tx.wait();
    };

    const onApproveRequest = async (accountId, requestId) => {
        const tx = await contract.approveWithdraw("" + accountId, "" + requestId);
        return await tx.wait();
    };

    const onWithdrawal = async (accountId, requestId) => {
        const tx = await contract.withdraw("" + accountId, "" + requestId);
        return await tx.wait();
    };

    const getAccountsQuery = () => {
        return useQuery(
            "accounts",
            getAccounts,
            {
                enabled: !!contract,
                initialData: []
            }
        );
    }

    const getBalanceQuery = (accountId) => {
        return useQuery(
            'accountBalance_' + accountId,
            () => getBalance(accountId),
            {
                enabled: !!contract,
                initialData: 0
            }
        );
    };

    const getOwnersQuery = (accountId) => {
        return useQuery(
            "accountOwners_" + accountId,
            () => getOwners(accountId),
            {
                enabled: !!contract,
                initialData: []
            }
        );
    };

    const getStatsQuery = (accountId) => {
        return useQuery(
            'accountStats_' + accountId,
            () => getAccountStats(accountId),
            {
                enabled: !!contract,
                initialData: []
            });
    }

    const getWithdrawalRequestsQuery = (accountId) => {
        return useQuery(
            "accountWithdrawalRequests_" + accountId,
            () => getWithdrawalRequests(accountId),
            {
                enabled: !!contract,
                initialData: []
            }
        );
    }

    const getTransactionsQuery = (accountId) => {
        return useQuery(
            "accountTransactions_" + accountId,
            () => getTransactions(accountId),
            {
                enabled: !!contract,
                initialData: []
            }
        );

    };

    return (
        <AccountContext.Provider value={{
            contract,
            getAccountsQuery,
            onCreateAccount,
            onDeposit,
            onWithdrawalRequest,
            onWithdrawal,
            onApproveRequest,
            getBalanceQuery,
            getOwnersQuery,
            getStatsQuery,
            getWithdrawalRequestsQuery,
            getTransactionsQuery,
        }}>
            {children}
        </AccountContext.Provider>
    );
}

export default AccountContext;
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';

function AccountDetails({ userId, contract }) {
    const { accountId } = useParams();

    const [owners, setOwners] = useState([]);
    const [balance, setBalance] = useState(0);
    const [deposits, setDeposits] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [withdrawalRequests, setWithdrawalsRequests] = useState([]);

    const getAccountOwners = async () => {
        const accountOwners = await contract.getOwners(accountId);
        setOwners(accountOwners);
    };

    const getAccountBalance = async () => {
        const accountBalance = await contract.getBalance(accountId);
        setBalance(ethers.utils.formatEther(accountBalance.toString()));
    };

    const getDeposits = async () => {
        const depositsFilter = contract.filters.Deposit(null, accountId);
        contract
            .queryFilter(depositsFilter, 0, "latest")
            .then((e) => {
                const depositEvents = e.sort((a, b) => {
                    return a - b;
                }).map((depositEvent) => {
                    const user = depositEvent.args.user;
                    const amount = ethers.utils.formatEther(depositEvent.args.value.toString());
                    return { user, amount };
                });
                setDeposits(depositEvents);
            });
    }

    const getWithdrawalRequests = async () => {
        const withdrawRequestFilter = contract.filters.WithdrawRequested(null, accountId);
        const requestEvents = await contract.queryFilter(withdrawRequestFilter, 0, "latest");
        const requests = await Promise.all(requestEvents.sort((a, b) => a - b).map(async (requestEvent) => {
            const user = requestEvent.args.user;
            const id = requestEvent.args.withdrawId.toNumber();
            const amount = ethers.utils.formatEther(requestEvent.args.amount.toString());
            return { id, user, amount };
        }));

        setWithdrawalsRequests(requests);
    }

    const approveRequest = async (requestId) => {
        await contract.approveWithdraw(accountId, requestId);
    };

    const getRequestStatus = async (requestId) => {
        const isApproved = await contract.isWithdrawalRequestApproved(accountId.toString(), requestId.toString());
        return isApproved;
    };

    const withdraw = async (requestId) => {
        await contract.withdraw(accountId.toString(), requestId.toString());
    };

    useEffect(() => {
        if (contract) {
            if (owners.length == 0) getAccountOwners();
            getAccountBalance();
            getDeposits();
            getWithdrawalRequests();
        }
    }, [contract, owners, balance]);

    return (
        <div className="card p-4 grid grid-cols-1 gap-4 bg-gray-100">
            <Link to={"/"}>
                <div className='w-full px-4 py-2 flex items-center rounded-lg text-zinc-900 border-solid border-[1px] border-zinc-400'>
                    <MdArrowBackIos />
                    <span>Back</span>
                </div>
            </Link>

            <div>
                <h2 className='font-bold'>Balance:</h2>
                <p>ETH {balance}</p>
            </div>

            <div>
                <h2 className='font-bold'>Owners:</h2>
                <ul>
                    {owners.map((owner, id) => <li key={id} className="mt-2">{owner}</li>)}
                </ul>
            </div>
            <div>
                <h2 className='font-bold'>Deposits:</h2>
                <table className='w-full' cellPadding="4" cellSpacing="4">
                    <thead>
                        <tr>
                            <th className='text-left'>Owner</th>
                            <th colSpan={2}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            deposits.map(
                                (deposit, id) => (
                                    <tr key={id}>
                                        <td>{deposit.user}</td><td>ETH</td><td>{deposit.amount}</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
                <ul>
                </ul>
            </div>
            <div>
                <h2 className='font-bold'>Withdrawal:</h2>
                <ul>
                    {withdrawals.map((withdrawal, id) => <li key={id} className="mt-2">{withdrawal}</li>)}
                </ul>
            </div>
            <div>
                <h2 className='font-bold'>Withdrawal Requests:</h2>
                <table className='w-full' cellPadding="4" cellSpacing="4">
                    <thead>
                        <tr>
                            <th className='text-left'>Owner</th>
                            <th colSpan={2}>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            withdrawalRequests.map(
                                (request, id) => (
                                    <tr key={id}>
                                        <td>{request.user}</td>
                                        <td>ETH</td>
                                        <td>{request.amount}</td>
                                        <td>
                                            {
                                                getRequestStatus(request.id)
                                                    ? (userId === request.user)
                                                        ? <button className='text-red-600' onClick={() => withdraw(request.id)}>Withdraw</button>
                                                        : <p className='text-center text-green-900'>Approved</p>
                                                    : (userId !== request.user)
                                                        ? <button className='text-green-400' onClick={() => approveRequest(request.id)}>Approve</button>
                                                        : <p className='text-center text-gray-400'>Pending</p>
                                            }
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex flex-col gap-2">
                <Link to={`/deposits/${accountId}`} className='px-4 py-2 w-full rounded-lg text-center bg-zinc-900 text-white'>Deposit</Link>
                <Link to={`/requests/${accountId}`} className='px-4 py-2 w-full rounded-lg text-center text-red-600 border-solid border-[1px] border-red-600'>Request withdrawal</Link>
            </div>
        </div>
    );
}

export default AccountDetails;
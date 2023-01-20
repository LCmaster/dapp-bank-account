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

function AccountDetails() {
    const { accountId } = useParams();

    const { contract } = useContext(Web3Context);

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

    return (
        <div className='grid grid-flow-row auto-rows-min gap-6'>
            <div className="w-full py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <Link to={"/"} className="inline-block flex gap-2 items-center"><MdArrowBackIos /> Back</Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                    <AccountBalance accountId={accountId} balance={0} />
                </div>
                <DepositForm depositHandler={onDeposit} />
                <WithdrawalForm />
            </div>
            <AccountOwners />
            <WithdrawalRequestsList />
            <TransactionList />
        </div>
    );
}

export default AccountDetails;
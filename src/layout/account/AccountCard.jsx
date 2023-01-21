import { ethers } from 'ethers';
import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import BalanceChart from '../../components/BalanceChart';
import Card from '../../components/Card';
import LinkButton from '../../components/LinkButton';
import AccountContext from '../../context/AccountContext';
import ContractContext from '../../context/ContractContext';

import Web3Context from '../../context/Web3Context';

function AccountCard({ accountId }) {
    const { getBalanceQuery, getStatsQuery } = useContext(AccountContext);



    const balanceQuery = getBalanceQuery(accountId);
    const statsQuery = getStatsQuery(accountId);

    return (
        <Card>
            <div className="account-summary flex flex-col justify-between gap-4">
                {
                    accountId !== null
                        ? <h1 className='flex justify-between items-end'>
                            <span className='font-bold text-4xl'>{accountId}</span>
                            <span className='text-xl'>{balanceQuery.data} ETH</span>
                        </h1>
                        : null
                }
                <div className="chart aspect-video">
                    <BalanceChart data={statsQuery.data} />
                </div>
                <LinkButton to={`accounts/${accountId}`}>Select account</LinkButton>
            </div>
        </Card>
    );
}

export default AccountCard;
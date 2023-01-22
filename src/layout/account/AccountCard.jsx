import React, { useContext, useEffect } from 'react';
//CONTEXTS
import AccountContext from '../../context/AccountContext';
//COMPONENTS
import Card from '../../components/Card';
import LinkButton from '../../components/LinkButton';
import BalanceChart from '../../components/BalanceChart';


function AccountCard({ accountId }) {
    const { getBalanceQuery, getStatsQuery, contract } = useContext(AccountContext);

    const balanceQuery = getBalanceQuery(accountId);
    const statsQuery = getStatsQuery(accountId);

    const refetchOnDepositEvent = (user, account, amount, timestamp) => {
        if (account.toNumber() == accountId) {
            balanceQuery.refetch();
            statsQuery.refetch();
        }
    };
    const refetchOnWithdrawalEvent = (user, account, withdrawId, amount, timestamp) => {
        if (account.toNumber() == accountId) {
            balanceQuery.refetch();
            statsQuery.refetch();
        }
    };

    useEffect(() => {
        if (contract) {
            contract.on("Withdraw", refetchOnWithdrawalEvent);
            contract.on("Deposit", refetchOnDepositEvent);

            return () => {
                contract.off("Deposit", refetchOnDepositEvent);
                contract.off("Withdraw", refetchOnWithdrawalEvent);
            }
        }
    }, [contract]);

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
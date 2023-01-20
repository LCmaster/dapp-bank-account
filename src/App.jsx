import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { BiExit } from 'react-icons/bi';

import { ethers } from 'ethers';
import { contract as contractInfo } from './abi/deployment.json';

import AccountsPage from "./components/AccountsPage";
import AccountDetails from "./components/AccountDetails";
import DepositPage from "./components/DepositPage";
import WithdrawalRequestPage from "./components/WithdrawalRequestPage";
import WithdrawalPage from "./components/WithdrawalPage";

function App() {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [bankAccounts, setBankAccounts] = useState();

  const updateWeb3Account = (accounts) => {
    if (accounts.length > 0) {
      const accountAddr = ethers.utils.getAddress(accounts[0])
      setAccount((prev) => (accountAddr !== prev) ? accountAddr : prev);
    } else {
      setAccount(null);
    }
  };

  const updateWeb3Provider = () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    setWeb3(web3Provider);
  };

  const updateBankAccountContract = () => {
    const signer = web3.getSigner();
    const bankContract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
    setContract((prev) => (bankContract !== prev) ? bankContract : prev);

    bankContract.on("AccountCreated", (owners, id, timestamp) => { updateBankAccounts(); })
  };

  const updateBankAccounts = async () => {
    if (contract) {
      const accounts = await contract.getAccounts();
      const readableAccounts = accounts.map((bankAccountId) => bankAccountId.toNumber());
      setBankAccounts((prev) => (readableAccounts != prev) ? readableAccounts : prev);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then(updateWeb3Account)
        .catch((err) => {
          // Some unexpected error.
          // For backwards compatibility reasons, if no accounts are available,
          // eth_accounts will return an empty array.
          console.error(err);
        });

      window.ethereum.on('accountsChanged', updateWeb3Account);

      if (account && !web3) updateWeb3Provider();

      if (web3 && !contract) updateBankAccountContract();

      if (contract && !bankAccounts) updateBankAccounts();

      return () => {
        window.ethereum.removeListener('accountsChanged', updateWeb3Account);
      };
    } else {
      console.error('Please install MetaMask!', error);
    }
  }, [web3, account, contract, bankAccounts]);

  return (
    <BrowserRouter>
      <div className="flex flex-col gap-4">
        <header className="px-4 py-2 flex justify-between items-center bg-zinc-900 text-white ">
          <h1 className="font-bold">Bank Accounts</h1>

          {
            account
              ? <div className="flex px-4 py-2 gap-2">
                <p>{account.slice(0, 7)}...{account.slice(-5)}</p>
                <button><BiExit /></button>
              </div>
              : <button className="px-4 py-2 rounded-lg border-solid border-[1px] border-white">Connect</button>
          }

        </header>

        <main className="flex justify-center items-center">
          <Routes>
            <Route path="/" element={<AccountsPage accounts={bankAccounts} contract={contract} />} />
            <Route path="/accounts/:accountId" element={<AccountDetails userId={account} contract={contract}/>} />
            <Route path="/deposits/:accountId" element={<DepositPage contract={contract}/>} />
            <Route path="/withdrawals/:accountId/:withdrawalId" element={<WithdrawalPage contract={contract}/>} />
            <Route path="/requests/:accountId" element={<WithdrawalRequestPage contract={contract}/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { BiExit } from 'react-icons/bi';

import { ethers } from 'ethers';
import { contract as contractInfo } from './abi/deployment.json';

import AuthContext from './context/AuthContext'

import AccountsPage from "./components/AccountsPage";
import AccountDetails from "./components/AccountDetails";
import DepositPage from "./components/DepositPage";
import WithdrawalRequestPage from "./components/WithdrawalRequestPage";
import WithdrawalPage from "./components/WithdrawalPage";
import { useContext } from "react";
import LoginPage from "./layout/LoginPage";
import Web3Context from "./context/Web3Context";

function App() {

  const { isLoggedIn, onLogIn } = useContext(AuthContext);
  const { wallet } = useContext(Web3Context);

  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [bankAccounts, setBankAccounts] = useState();

  if (!isLoggedIn) {
    return <LoginPage selectedAccount={wallet} />
  }

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
            <Route path="/accounts/:accountId" element={<AccountDetails userId={account} contract={contract} />} />
            <Route path="/deposits/:accountId" element={<DepositPage contract={contract} />} />
            <Route path="/withdrawals/:accountId/:withdrawalId" element={<WithdrawalPage contract={contract} />} />
            <Route path="/requests/:accountId" element={<WithdrawalRequestPage contract={contract} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

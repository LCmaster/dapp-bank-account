import React from "react";

import AuthContext from './context/AuthContext'
import { useContext } from "react";
import LoginPage from "./layout/LoginPage";
import Web3Context from "./context/Web3Context";
import Dashboard from "./layout/Dashboard";

function App() {

  const { isLoggedIn, onLogIn } = useContext(AuthContext);
  const { wallet } = useContext(Web3Context);

  return (!isLoggedIn) ? <LoginPage selectedAccount={wallet} /> : <Dashboard />;
}

export default App;

import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
//PROVIDERS
import Web3Context from "./context/Web3Context";
//COMPONENTS
import LoginPage from "./layout/LoginPage";
import Dashboard from "./layout/Dashboard";

function App() {
  const { wallet } = useContext(Web3Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (wallet) {
      navigate("/accounts");
    } else {
      navigate("/login");
    }
  }, [wallet]);

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/accounts/*' element={<Dashboard />} />
    </Routes>
  );
}

export default App;

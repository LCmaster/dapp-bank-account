import React from "react";
import { Route, Routes } from "react-router-dom";
//PROVIDERS
import { AuthProvider } from './context/AuthContext'
import { Web3Provider } from './context/Web3Context'
//COMPONENTS
import LoginPage from "./layout/LoginPage";
import Dashboard from "./layout/Dashboard";

function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <Routes>
          <Route path='/*' element={<Dashboard />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Web3Provider>
  );
}

export default App;

import React from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountDetailsPage from './account/AccountDetailsPage';
import Web3Context from '../context/Web3Context';
import { AccountProvider } from '../context/AccountContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import AccountsPage from './account/AccountsPage';
import Header from './Header';

function Dashboard() {
    const { userId, onLogOut } = useContext(AuthContext);
    const { web3, contract } = useContext(Web3Context);

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className='container mx-auto dashboard'>
                <Header />

                <div className="w-full p-2">

                    <div className="mt-4">
                        <AccountProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route path='/' element={<AccountsPage />} />
                                    <Route path='/accounts/:accountId' element={<AccountDetailsPage />} />
                                </Routes>
                            </BrowserRouter>
                        </AccountProvider>
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
}

export default Dashboard;
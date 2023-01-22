import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
//PROVIDERS
import { AccountProvider } from '../context/AccountContext';
import { ContractProvider } from '../context/ContractContext';
//COMPONENTS
import Header from './Header';
import AccountsPage from './account/AccountsPage';
import AccountDetailsPage from './account/AccountDetailsPage';

function Dashboard() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ContractProvider>
                <AccountProvider>
                    <div className='container mx-auto dashboard'>
                        <Header />
                        <div className="w-full mt-4 py-2 px-4">
                            <Routes>
                                <Route path='/accounts/:accountId' element={<AccountDetailsPage />} />
                                <Route path='*' element={<AccountsPage />} />
                            </Routes>
                        </div>
                    </div>
                </AccountProvider>
            </ContractProvider>
        </QueryClientProvider>
    );
}

export default Dashboard;
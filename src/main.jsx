import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
//CONTEXTS
import { Web3Provider } from './context/Web3Context'
//COMPONENTS
import App from './App'
//RESOURCES
import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Web3Provider>
    </QueryClientProvider>
  </React.StrictMode>,
)

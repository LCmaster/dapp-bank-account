import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';
import EthereumButton from '../components/EthereumButton';
import MetamaskButton from '../components/MetamaskButton';
import MetamaskLogo from '../components/MetamaskLogo';

//CONTEXTS
import AuthContext from '../context/AuthContext';
import Web3Context from '../context/Web3Context';

function LoginPage() {
    const { wallet, onConnectMetamask } = useContext(Web3Context);
    const { onLogIn } = useContext(AuthContext);

    const connectToMetamask = async () => {
        await onConnectMetamask();
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="space-y-6">
                    <h5 className="text-center text-xl font-medium text-gray-900 dark:text-white">Welcome</h5>
                    <div>
                        <MetamaskButton onClick={() => connectToMetamask()} disabled={wallet} type="button" className="w-full" />
                    </div>
                    <div>
                        {wallet && <EthereumButton walletAddr={wallet} className="w-full" />}
                    </div>
                    <Button onClick={() => onLogIn(uuidv4())} className="w-full">Log in</Button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
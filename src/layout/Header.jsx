import React, { useContext } from 'react'
// CONTEXTS
import AuthContext from '../context/AuthContext';
//COMPONENTS
import EthereumButton from '../components/EthereumButton';

function Header() {
    const { userId } = useContext(AuthContext);
    return (
        <header className='p-2 flex justify-between items-center'>
            <div className="logo flex items-center gap-2">
                <div className="p-2 bg-gray-200 rounded-full">
                    <svg className="w-8 h-8 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                </div>
                <h2 className='font-bold leading-tight'>Shared<br />Accounts</h2>

            </div>
            <EthereumButton walletAddr={userId} />
        </header>
    )
}

export default Header
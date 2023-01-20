import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';

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
            <button type="button" className={`bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2`}>
                <svg className="w-4 h-4 mr-2 -ml-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                {userId.slice(0, 8) + '...' + userId.slice(-6)}
            </button>
        </header>
    )
}

export default Header
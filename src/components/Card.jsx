import React from 'react';

function Card({ children }) {
    return (
        <div className='w-full h-full p-4 flex flex-col justify-between rounded-lg bg-gray-200'>
            {children}
        </div>
    );
}

export default Card;
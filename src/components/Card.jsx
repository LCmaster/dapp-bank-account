import React from 'react';

function Card({ children, className }) {
    return (
        <div className={`p-4 flex flex-col justify-between rounded-lg bg-gray-100 ${className}`}>
            {children}
        </div>
    );
}

export default Card;
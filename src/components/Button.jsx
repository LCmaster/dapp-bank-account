import React from 'react';

function Button({ children, className, ...rest }) {
    return (
        <button
            className={`
            px-5 py-2.5 mr-2 mb-2
            font-medium rounded-lg text-sm
            text-white bg-blue-700
            hover:bg-blue-800
            focus:ring-4 focus:ring-blue-300 focus:outline-none
            dark:bg-blue-600 dark:hover:bg-blue-700
            dark:focus:ring-blue-800

            ${className}
            `}

            {...rest}
        >{children}</button>
    );
}

export default Button;
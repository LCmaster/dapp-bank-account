import React from 'react';

function TextButton({ children, color, className, ...rest }) {
    return (
        <button
            {...rest}
            className={`font-medium uppercase text-${color}-600 dark:text-${color}-500 hover:underline${className}`}
        >
            {children}
        </button>
    );
}

export default TextButton;
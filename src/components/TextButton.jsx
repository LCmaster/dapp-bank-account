import React from 'react';

function TextButton({ children, className, ...rest }) {
    return (
        <button
            {...rest}
            className={`font-medium uppercase hover:underline ${className}`}
        >
            {children}
        </button>
    );
}

export default TextButton;
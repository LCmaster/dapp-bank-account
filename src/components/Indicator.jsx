import React from 'react';

function Indicator({ title, children }) {
    return (
        <div className='indicator'>
            <h3>{title}</h3>
        </div>
    );
}

export default Indicator;
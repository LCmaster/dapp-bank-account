import React from 'react';
import {MdArrowForwardIos} from 'react-icons/md';

function BankAccountButton({accountId}) {
  return (
    <div className='w-full px-4 py-2 flex justify-between items-center rounded-lg text-zinc-900 border-solid border-[1px] border-zinc-400 text-2xl'>
        {accountId}
        <MdArrowForwardIos />
    </div>
  );
}

export default BankAccountButton;
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';

function DepositPage({ contract }) {
  const {accountId} = useParams();

  const [amount, setAmount] = useState(0);

  const makeDeposit = async () => {
    if(contract) {
      const tx = await contract.deposit(""+accountId, { value: ethers.utils.parseUnits(""+amount, "ether") });
      await tx.wait();
      console.log("Deposit successful!");
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    makeDeposit();
  }
  return (
    <div className="card p-4 bg-gray-100">
      <Link to={"/"}>
        <div className='w-full px-4 py-2 flex items-center rounded-lg text-zinc-900 border-solid border-[1px] border-zinc-400'>
          <MdArrowBackIos />
          <span>Back</span>
        </div>
      </Link>
      <h2 className='mt-4 font-bold'>Make a deposit</h2>
      <form onSubmit={submitHandler}>
        <div className="mb-2" >
          <label htmlFor='amount'>Amount:</label>
        </div>
        <div className="mb-2" >
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.valueAsNumber)} className="px-4 py-2 rounded-lg border-solid border-[1px] border-zinc-300" />
          <span>ETH</span>          
        </div>
        <input type='submit' className="mt-4 px-4 py-2 w-full rounded-lg bg-zinc-900 text-white" value="Deposit"  />
      </form>
    </div>
  );
}

export default DepositPage;
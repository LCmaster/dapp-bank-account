import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useContext } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import AccountContext from '../../context/AccountContext';

function CreateAccountForm() {
    const { onCreateAccount } = useContext(AccountContext);

    const [inputs, setInputs] = useState([""]);

    const addOwner = () => {
        const owners = inputs;
        inputs.push("");
        setInputs([...inputs]);
    };

    const inputFieldHandler = (id, value) => {
        inputs[id] = value;
        setInputs([...inputs]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const addicionatlOwners = inputs
            .filter((entry) => entry && entry.trim() !== "")
            .map(entry => ethers.utils.getAddress(entry));
        onCreateAccount(addicionatlOwners);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between gap-4">
            <div className="top-part">
                <h2 className='mb-4 text-2xl'>Create an account</h2>
                <div className="owners">
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Addicional owners</label>

                        {inputs.map((owner, id) => (
                            <div key={id}>
                                <input
                                    type="text"
                                    placeholder="0x0000000000000000000000000000000000000000"
                                    className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={owner}
                                    onChange={(ev) => inputFieldHandler(id, '' + ev.target.value)}
                                />
                            </div>
                        )
                        )}
                    </div>
                    <button onClick={() => addOwner()} type="button" className="w-full flex justify-center items-center py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"><AiOutlinePlus /></button>
                </div>
            </div>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create new account</button>
        </form>
    );
}

export default CreateAccountForm;
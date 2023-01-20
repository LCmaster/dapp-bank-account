import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';

function CreateAccountForm({onCreateAccount}) {
    const [inputs, setInputs] = useState({
        owner: [""]
    });

    const addOwner = () => {
        const owners = inputs.owner;
        owners.push("");
        setInputs({
            owner: [...owners]
        });
    };

    const inputFieldHandler = (id, value) => {
        const owners = inputs.owner;
        owners[id] = value;
        setInputs({
            owner: [...owners]
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const owners = inputs.owner;
        const addicionatlOwners = owners.filter((entry) => entry && entry.trim() !== "" );
        onCreateAccount(addicionatlOwners);
    };

    return (
        <div className='pt-2'>
            <form onSubmit={handleSubmit}>
                <label>Additional Owner(s):</label>
                {inputs.owner.map((owner, id) => (
                    <div key={id}>
                        <input 
                            type="text" 
                            className="px-4 py-2 rounded-lg border-solid border-[1px] border-zinc-300" 
                            value={owner}
                            onChange={ (ev) => inputFieldHandler(id, ''+ev.target.value)} 
                        />
                    </div>
                    )
                )}

                <button 
                    type='button'
                    disabled={inputs.owner.length >= 3}
                    className='mt-2 p-2 w-full flex justify-center items-center rounded-lg text-zinc-900 border-solid border-[1px] border-zinc-900 text-2xl'
                    onClick={() => addOwner()}
                >
                    <BiPlus />
                </button>
                <input type='submit' className="mt-4 px-4 py-2 w-full rounded-lg bg-zinc-900 text-white" value="Create account"  />
            </form>
        </div>
    );
}

export default CreateAccountForm;
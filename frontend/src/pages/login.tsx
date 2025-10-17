import React from 'react'
import { useState } from 'react';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);   //Send the values to API backend for authentication
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }
    return (

        <div className='flex flex-col items-center justify-center min-h-screen bg-[#011C27]'>
            <h1 className='text-[150px] text-white font-times'>Hydration Station <span className='text-[#8B8383]'>Login</span></h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className='rounded w-full h-11 m-5'
                />

                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className='rounded w-full h-11 m-5'
                />

                <button
                    type='submit'
                    className='rounded w-1/2 mx-auto h-8 m-5 bg-[#8B8383] text-white block hover:bg-[#011C27]'
                >
                    Login
                </button>
            </form>
        </div>
    )
}
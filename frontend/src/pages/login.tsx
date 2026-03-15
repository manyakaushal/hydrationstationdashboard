import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const res = await fetch('http://localhost:4000/api/auth/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        if (res.ok){
            const data = await res.json();
            localStorage.setItem('token', data.token);
            navigate("/dashboard");
        } else{
            alert("Invalid credentials");
        }
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
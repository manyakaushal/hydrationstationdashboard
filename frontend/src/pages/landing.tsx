import React from 'react'
import LoginButton from '../assets/LoginButton'
import SignupButton from '../assets/SignupButton'

export default function Landing(){
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-[#011C27]'>
            <h1 className='text-[150px] text-white font-times'>Hydration Station</h1>
            <div className='flex flex-col items-center justify-center'>
                <LoginButton />
            </div>
        </div>
    )
}
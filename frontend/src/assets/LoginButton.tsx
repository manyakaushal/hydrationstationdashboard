import React from "react"
import { useNavigate } from "react-router-dom"

export default function LoginButton(){
    const navigate = useNavigate();

    const handleclick = () => {
        navigate('/login')
    }
    return (
        <button className="w-[442px] h-[138px] text-[96px] bg-[#3B6C80] text-white rounded-[200px] m-[25px] font-light font-times" onClick={handleclick}>
            Login
        </button>
    )
}
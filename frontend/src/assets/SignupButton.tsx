import React from "react";
import { useNavigate } from "react-router-dom";


export default function SignupButton(){
    const navigate = useNavigate();

    const handleclick = () => {
        navigate('/pages/signup')
    }
    return (
        <button className="w-[538px] h-[155px] text-[96px] bg-[#88B8CC] text-white rounded-[53px] m-[25px] font-light font-times" onClick={handleclick}>
            Sign up
        </button>
    )
}
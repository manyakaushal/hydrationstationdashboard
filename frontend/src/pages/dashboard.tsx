import React from "react";
import LogoutButton from "../assets/LogoutButton";
export default function Dashboard(){
    const token = localStorage.getItem("token");
    const res = async () => await fetch("http://localhost:4000/api/dashboard/data", {
        headers:{
            Authorization: `Bearer: ${token}`,
        },
    });
    return(
        <div className='flex flex-col items-left justify-top min-h-screen bg-[#011C27]'>
            {/* HEADER */}
            <div className="flex items-center justify-between px-10 pt-5">
                <h1 className='text-[70px] text-white font-times'>Hydration Station <span className="text-[50px] text-gray-500">dashboard</span></h1>
                <LogoutButton />
            </div>
        </div>
    )
}
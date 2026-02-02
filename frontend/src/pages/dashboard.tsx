import React from "react";
import LogoutButton from "../assets/LogoutButton";
import DataCard from "../assets/DataCard";
import { useEffect } from "react";

type HydrationData = {
    bottlesWashed: number;
    lastClearningCycleAt: Date;
}
export default function Dashboard(){
    const token = localStorage.getItem("token");

    // useEffect(() => {
    //     const loadDashboardData = async() => {
    //         const res = await fetch("http://localhost:4000/api/dashboard", {
    //             headers:{
    //                 Authorization: `Bearer: ${token}`,
    //             },
    //         });
    //         const data: HydrationData = await res.json();
    //         console.log("data: ", data);
    //     }
    //     loadDashboardData();
    // })
    

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
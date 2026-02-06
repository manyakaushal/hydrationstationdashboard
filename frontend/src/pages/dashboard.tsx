import React from "react";
import LogoutButton from "../assets/LogoutButton";
import DataCard from "../assets/DataCard";
import { useEffect } from "react";
import { RechartsDevtools } from "@recharts/devtools";
import { LineChart, Line, XAxis, ResponsiveContainer, CartesianGrid, YAxis, Legend, Tooltip} from "recharts";

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
    
    const chartData = [
        {month: "Jan", powerLevel: 80},
        {month: "Feb", powerLevel: 75},
        {month: "Mar", powerLevel: 90},
        {month: "Apr", powerLevel: 85},
        {month: "May", powerLevel: 70},
        {month: "Jun", powerLevel: 95},    
    ]
    return(
        <div className='flex flex-col items-left justify-top min-h-screen bg-[#011C27]'>
            {/* HEADER */}
            <div className="flex items-center justify-between px-10 pt-5">
                <h1 className='text-[70px] text-white font-times'>Hydration Station <span className="text-[50px] text-gray-500">dashboard</span></h1>
                <LogoutButton />
            </div>
            {/* GRAPHS */}
            <div className="px-10 pt-6 flex flex-col gap-6">
            {/* Graph 1 Card */}
            <div className="bg-[#022D39] rounded-xl p-6">
                <h2 className="text-white text-xl mb-4">
                Power Level For Hydration Station 1
                </h2>
                <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                <CartesianGrid stroke="#aaa" strokeDasharray="5 5"/>
                <Line dataKey="powerLevel" stroke="purple" strokeWidth={2} name="Power Level"/>
                <XAxis dataKey="month" />
                <YAxis width="auto" label={{ value: 'Power Level', angle: -90, position: 'insideLeft', fill: 'white' }} />
                <Legend align="right"/>
                <Tooltip/>
                <RechartsDevtools />
                </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
            {/* Graph 2 Card */}
            <div className="bg-[#022D39] rounded-xl p-6">
                <h2 className="text-white text-xl mb-4">
                Water Used For Hydration Station 1
                </h2>
                <div className="h-72 w-full flex items-center justify-center text-gray-400">
                {/* temp empty text */}
                </div>
            </div>
        </div>
        </div>
    )
}
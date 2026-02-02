import React from "react";
import LogoutButton from "../assets/LogoutButton";
import DataCard from "../assets/DataCard";
import { useEffect, useState } from "react";

type HydrationData = {
    bottlesWashed: number;
    lastCleaningCycleAt: string;
}
export default function Dashboard(){
    const token = localStorage.getItem("token");
    const [dashboardData, setDashboardData] = useState<HydrationData | null>(null);

    useEffect(() => {
        const loadDashboardData = async() => {
            const res = await fetch("http://localhost:4000/api/dashboard", {
                headers:{
                    Authorization: `Bearer: ${token}`,
                },
            });
            const fetchData: HydrationData = await res.json();
            fetchData.lastCleaningCycleAt = formatDate(fetchData.lastCleaningCycleAt);
            setDashboardData(fetchData);
            console.log(fetchData);
            console.log(fetchData.lastCleaningCycleAt);
        }
        if (token){
            loadDashboardData();
        }
    }, [token])
    
    const formatDate = (dateString: string) => {
        const formatted = new Date(dateString).toLocaleString(
            "en-US",
            {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: true,
            }
        );
        return formatted;
    }

    

    return(
        <div className='flex flex-col items-left justify-top min-h-screen bg-[#011C27]'>
            {/* HEADER */}
            <div className="flex items-center justify-between px-10 pt-5">
                <h1 className='text-[70px] text-white font-times'>Hydration Station <span className="text-[50px] text-gray-500">dashboard</span></h1>
                
                <LogoutButton />
            </div>
            <div className="flex flex-col gap-6 px-10 mt-10">
                {dashboardData &&
                    <DataCard
                    text="Bottles Washed"
                    data={dashboardData.bottlesWashed}
                    />
                }
                {dashboardData &&
                    <DataCard
                    text="Last Cleaning Cycle At"
                    data={dashboardData.lastCleaningCycleAt}
                    />
                }
            </div>
        </div>
    )
}
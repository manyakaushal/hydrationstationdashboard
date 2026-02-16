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

type TimeRange = "days" | "weeks" | "months";
export default function Dashboard(){
    const token = localStorage.getItem("token");
    const [selectedGraph1, setSelectedGraph1] = React.useState<TimeRange>("days");
    const [selectedGraph2, setSelectedGraph2] = React.useState<TimeRange>("days");

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
    const chartDatadays1 = [
        {label: "Day 1", powerLevel: 80},
        {label: "Day 2", powerLevel: 75},
        {label: "Day 3", powerLevel: 90},
        {label: "Day 4", powerLevel: 85},
        {label: "Day 5", powerLevel: 70},
        {label: "Day 6", powerLevel: 95},
        {label: "Day 7", powerLevel: 82}
    ]
    const chartDataweeks1 = [
        {label: "Week 1", powerLevel: 80},
        {label: "Week 2", powerLevel: 75},
        {label: "Week 3", powerLevel: 90},
        {label: "Week 4", powerLevel: 85},
    ]
    const chartDatamonths1 = [
        {label: "Jan", powerLevel: 80},
        {label: "Feb", powerLevel: 75},
        {label: "Mar", powerLevel: 90},
        {label: "Apr", powerLevel: 85},
        {label: "May", powerLevel: 70},
        {label: "Jun", powerLevel: 95},    
    ] 
    const chartDatadays2 = [
        {label: "Day 1", waterUsed: 85},
        {label: "Day 2", waterUsed: 70},
        {label: "Day 3", waterUsed: 95},
        {label: "Day 4", waterUsed: 80},
        {label: "Day 5", waterUsed: 75},
        {label: "Day 6", waterUsed: 90},
        {label: "Day 7", waterUsed: 82}
    ]
    const chartDataweeks2 = [
        {label: "Week 1", waterUsed: 85},
        {label: "Week 2", waterUsed: 70},
        {label: "Week 3", waterUsed: 95},
        {label: "Week 4", waterUsed: 80},
    ]
    const chartDatamonths2 = [
        {label: "Jan", waterUsed: 500},
        {label: "Feb", waterUsed: 450},
        {label: "Mar", waterUsed: 600},
        {label: "Apr", waterUsed: 550},
        {label: "May", waterUsed: 400},
        {label: "Jun", waterUsed: 650},    
    ]
    const dataToDisplay1 = 
        selectedGraph1 === "days"
        ? chartDatadays1
        : selectedGraph1 === "weeks"
        ? chartDataweeks1
        : chartDatamonths1;

    const dataToDisplay2 =
        selectedGraph2 === "days"
        ? chartDatadays2
        : selectedGraph2 === "weeks"
        ? chartDataweeks2
        : chartDatamonths2;
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
                <select
                value={selectedGraph1}
                onChange={(e) => setSelectedGraph1(e.target.value as TimeRange)}
            >
                <option value="days">Last 7 Days</option>
                <option value="weeks">Last 4 Weeks</option>
                <option value="months">Last 6 Months</option>
            </select>
                <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataToDisplay1}>
                <CartesianGrid stroke="#aaa" strokeDasharray="5 5"/>
                <Line dataKey="powerLevel" stroke="purple" strokeWidth={2} name="Power Level"/>
                <XAxis dataKey="label" />
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
                <select
                value={selectedGraph2}
                onChange={(e) => setSelectedGraph2(e.target.value as TimeRange)}
            >
                <option value="days">Last 7 Days</option>
                <option value="weeks">Last 4 Weeks</option>
                <option value="months">Last 6 Months</option>
            </select>
                <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataToDisplay2}>
                <CartesianGrid stroke="#000"/>
                <Line dataKey="waterUsed" stroke="cyan" strokeWidth={5} name="Water Used (L)"/>
                <XAxis dataKey="label" />
                <YAxis width="auto" label={{ value: 'Water Used (L)', angle: -90, position: 'insideLeft', fill: 'white' }} />
                <Legend align="right"/>
                <Tooltip/>
                <RechartsDevtools />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        </div>
        </div>
    )
}
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
type DailyData1 = {date: string, powerLevel: number};
type DailyData2 = {date: string, waterUsed: number};
type TimeRange = "days" | "weeks" | "months";

const chartDatadays1 = [
    {date: "2026-02-02", powerLevel: 80},
    {date: "2026-02-03", powerLevel: 75},
    {date: "2026-02-04", powerLevel: 90},
    {date: "2026-02-05", powerLevel: 85},
    {date: "2026-02-06", powerLevel: 70},
    {date: "2026-02-07", powerLevel: 95},
    {date: "2026-02-08", powerLevel: 82},
    {date: "2026-02-09", powerLevel: 88},
    {date: "2026-03-10", powerLevel: 78},
    {date: "2026-03-11", powerLevel: 92},
    {date: "2026-03-12", powerLevel: 80},
    {date: "2026-03-13", powerLevel: 85},
    {date: "2026-03-14", powerLevel: 90},
    {date: "2026-03-15", powerLevel: 78},
    {date: "2026-03-16", powerLevel: 88},
    {date: "2026-03-17", powerLevel: 95},
    {date: "2026-03-18", powerLevel: 80},
    {date: "2026-03-19", powerLevel: 85}
];
const chartDatadays2 = [
    {date: "2026-02-02", waterUsed: 85},
    {date: "2026-02-03", waterUsed: 70},
    {date: "2026-02-04", waterUsed: 95},
    {date: "2026-02-05", waterUsed: 80},
    {date: "2026-02-06", waterUsed: 75},
    {date: "2026-02-07", waterUsed: 90},
    {date: "2026-02-08", waterUsed: 82}
];

function aggregateDataByRange <T extends {date: string} > (
    data: T[],
    range: TimeRange,
    valueKey: keyof T,
    mode: "sum" | "average" = "sum"
){
    if (range === "days"){
        return [...data].sort((a,b) => a.date.localeCompare(b.date)).map((row) => ({...row, label: row.date}));
    }
    const keyFn = range === "weeks" ? startOfweekKey : monthKey;
    const totals = new Map<string, {sum: number, count: number}>();
        for (const row of data){
            const bucket = keyFn(row.date);
            const value = Number(row[valueKey]);
            const existing = totals.get(bucket) ?? {sum: 0, count: 0};
            totals.set(bucket, {sum: existing.sum + value, count: existing.count + 1});
        }
    return Array.from(totals.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(([bucket, total]) => ({
        label: bucket,
        [valueKey]: mode === "sum" ? total.sum : Number((total.sum / total.count).toFixed(1)),
        })) as Array<{label: string} & Record<string, number>>;
    }

        function startOfweekKey(dateISO: string){
        const d = new Date(dateISO);
        const day = (d.getUTCDay() + 6) % 7;
        d.setUTCDate(d.getUTCDate() - day);
        return d.toISOString().slice(0,10);
    }

    function monthKey (dateISO: string){
        return dateISO.slice(0,7);
    }

export default function Dashboard(){
    const token = localStorage.getItem("token");
    const [selectedGraph1, setSelectedGraph1] = React.useState<TimeRange>("days");
    const [selectedGraph2, setSelectedGraph2] = React.useState<TimeRange>("days");

    const dataToDisplay1 = React.useMemo(() => {
        return aggregateDataByRange(chartDatadays1, selectedGraph1, "powerLevel", "average");
    }, [selectedGraph1]);

    const dataToDisplay2 = React.useMemo(() => {
        return aggregateDataByRange(chartDatadays2, selectedGraph2, "waterUsed", "sum");
    }, [selectedGraph2]);
    
    const displayTooLil1 = !hasEnoughData(selectedGraph1, dataToDisplay1.length);
    const displayTooLil2 = !hasEnoughData(selectedGraph2, dataToDisplay2.length);

    function hasEnoughData(range: TimeRange, dataCount: number){
        if (range === "days"){return true;}
        if (range === "weeks"){return dataCount >=2;}
        if (range === "months"){return dataCount >= 2;}
        return true;
    }
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
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
            </select>
                <div className="h-72 w-full relative">
                    {displayTooLil1 && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="bg-black/60 text-white px-4 py-2 rounded-lg">
                        Not enough data to view {selectedGraph1} yet. Please check back later.
                        </div>
                        </div>
                    )}
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
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
            </select>
                <div className="h-72 w-full relative">
                    {displayTooLil2 && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="bg-black/60 text-white px-4 py-2 rounded-lg">
                        Not enough data to view {selectedGraph2} yet. Please check back later.
                        </div>
                        </div>
                    )
                    }
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
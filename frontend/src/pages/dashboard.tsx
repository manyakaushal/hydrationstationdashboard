import React, { useEffect, useState, useMemo } from "react";
import LogoutButton from "../assets/LogoutButton";
import DataCard from "../assets/DataCard";
import { RechartsDevtools } from "@recharts/devtools";
import { LineChart, Line, XAxis, ResponsiveContainer, CartesianGrid, YAxis, Legend, Tooltip } from "recharts";

type HydrationData = {
    bottlesWashed: number;
    lastCleaningCycleAt: string;
    powerHistory: { date: string, powerLevel: number }[];
    waterHistory: { date: string, waterUsed: number }[];
}

type TimeRange = "days" | "weeks" | "months";

/* --- FAKE DATA (COMMENTED OUT AS REQUESTED) ---
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
----------------------------------------------- */

// --- Aggregation Logic (Required for Weeks/Months view) ---
function startOfweekKey(dateISO: string) {
    const d = new Date(dateISO);
    const day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day);
    return d.toISOString().slice(0, 10);
}

function monthKey(dateISO: string) { return dateISO.slice(0, 7); }

function aggregateDataByRange<T extends { date: string }>(
    data: T[],
    range: TimeRange,
    valueKey: keyof T,
    mode: "sum" | "average" = "sum"
) {
    if (!data || data.length === 0) return [];
    if (range === "days") {
        return [...data].sort((a, b) => a.date.localeCompare(b.date)).map((row) => ({ ...row, label: row.date }));
    }
    const keyFn = range === "weeks" ? startOfweekKey : monthKey;
    const totals = new Map<string, { sum: number; count: number }>();
    for (const row of data) {
        const bucket = keyFn(row.date);
        const value = Number(row[valueKey]);
        const existing = totals.get(bucket) ?? { sum: 0, count: 0 };
        totals.set(bucket, { sum: existing.sum + value, count: existing.count + 1 });
    }
    return Array.from(totals.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([bucket, total]) => ({
        label: bucket,
        [valueKey]: mode === "sum" ? total.sum : Number((total.sum / total.count).toFixed(1)),
    })) as Array<{ label: string } & Record<string, number>>;
}

export default function Dashboard() {
    const token = localStorage.getItem("token");
    const [dashboardData, setDashboardData] = useState<HydrationData | null>(null);
    const [selectedGraph1, setSelectedGraph1] = useState<TimeRange>("days");
    const [selectedGraph2, setSelectedGraph2] = useState<TimeRange>("days");

    // Fetch live data from Ahmed's database via the API
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/dashboard", {
                    headers: { Authorization: `Bearer: ${token}` },
                });
                const data = await res.json();
                setDashboardData(data);
            } catch (err) { console.error("Fetch error:", err); }
        };
        if (token) loadDashboardData();
    }, [token]);

    // --- REAL DATA IMPLEMENTATION ---
    const dataToDisplay1 = useMemo(() => {
        return aggregateDataByRange(dashboardData?.powerHistory || [], selectedGraph1, "powerLevel", "average");
    }, [selectedGraph1, dashboardData]);

    const dataToDisplay2 = useMemo(() => {
        return aggregateDataByRange(dashboardData?.waterHistory || [], selectedGraph2, "waterUsed", "sum");
    }, [selectedGraph2, dashboardData]);

    const hasEnoughData = (range: TimeRange, count: number) => range === "days" ? count >= 1 : count >= 2;
    const displayTooLil1 = !hasEnoughData(selectedGraph1, dataToDisplay1.length);
    const displayTooLil2 = !hasEnoughData(selectedGraph2, dataToDisplay2.length);

    return (
        <div className='flex flex-col min-h-screen bg-[#011C27] pb-10 text-white'>
            {/* HEADER */}
            <div className="flex items-center justify-between px-10 pt-5">
                <h1 className='text-[70px] font-times'>Hydration Station <span className="text-[50px] text-gray-500">dashboard</span></h1>
                <LogoutButton />
            </div>

            {/* REAL DATA CARDS */}
            <div className="flex flex-row gap-6 px-10 mt-10">
                {dashboardData && <DataCard text="Bottles Washed" data={dashboardData.bottlesWashed} />}
                {dashboardData && <DataCard text="Last Cleaning" data={new Date(dashboardData.lastCleaningCycleAt).toLocaleDateString()} />}
            </div>

            <div className="px-10 pt-10 flex flex-col gap-10">
                {/* Power Graph */}
                <div className="bg-[#022D39] rounded-xl p-6">
                    <h2 className="text-xl mb-4">Power Level Trends</h2>
                    <select value={selectedGraph1} onChange={(e) => setSelectedGraph1(e.target.value as TimeRange)} className="mb-4 bg-[#011C27] text-white p-1 rounded border border-gray-600">
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </select>
                    <div className="h-72 relative">
                        {displayTooLil1 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg">
                                <p className="bg-black/80 px-4 py-2 rounded">Check back later for {selectedGraph1} data.</p>
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataToDisplay1}>
                                <CartesianGrid stroke="#444" strokeDasharray="5 5" />
                                <XAxis dataKey="label" stroke="#ccc" fontSize={12} />
                                <YAxis stroke="#ccc" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#011C27', border: '1px solid #444' }} />
                                <Legend />
                                <Line dataKey="powerLevel" stroke="purple" strokeWidth={3} dot={{ r: 4 }} />
                                <RechartsDevtools />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Water Graph */}
                <div className="bg-[#022D39] rounded-xl p-6">
                    <h2 className="text-xl mb-4">Water Usage (L)</h2>
                    <select value={selectedGraph2} onChange={(e) => setSelectedGraph2(e.target.value as TimeRange)} className="mb-4 bg-[#011C27] text-white p-1 rounded border border-gray-600">
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </select>
                    <div className="h-72 relative">
                        {displayTooLil2 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg">
                                <p className="bg-black/80 px-4 py-2 rounded">Check back later for {selectedGraph2} data.</p>
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataToDisplay2}>
                                <CartesianGrid stroke="#444" />
                                <XAxis dataKey="label" stroke="#ccc" fontSize={12} />
                                <YAxis stroke="#ccc" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#011C27', border: '1px solid #444' }} />
                                <Legend />
                                <Line dataKey="waterUsed" stroke="cyan" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState, useMemo } from "react";
import LogoutButton from "../assets/LogoutButton";
import { RechartsDevtools } from "@recharts/devtools";
import { LineChart, Line, XAxis, ResponsiveContainer, CartesianGrid, YAxis, Legend, Tooltip } from "recharts";

type HydrationData = {
    bottlesWashed: number;
    lastCleaningCycleAt: string;
    powerHistory: { date: string, powerLevel: number }[];
    waterHistory: { date: string, waterUsed: number }[];
}

type TimeRange = "days" | "weeks" | "months";


/* const chartDatadays1 = [
    {date: "2026-02-02", powerLevel: 80},
    {date: "2026-02-03", powerLevel: 75},
    {date: "2026-02-04", powerLevel: 90},
    {date: "2026-02-05", powerLevel: 85},
    {date: "2026-02-06", powerLevel: 70},
    {date: "2026-02-07", powerLevel: 95},
    {date: "2026-02-08", powerLevel: 82},
    {date: "2026-02-09", powerLevel: 88},
    {date: "2026-02-10", powerLevel: 78},
    {date: "2026-02-11", powerLevel: 92},
    {date: "2026-02-12", powerLevel: 80},
    {date: "2026-02-13", powerLevel: 85},
    {date: "2026-02-14", powerLevel: 90},
    {date: "2026-02-15", powerLevel: 78},
    {date: "2026-02-16", powerLevel: 88},
    {date: "2026-02-17", powerLevel: 95},
    {date: "2026-02-18", powerLevel: 80},
    {date: "2026-02-19", powerLevel: 85},
    {date: "2026-02-20", powerLevel: 80},
    {date: "2026-02-21", powerLevel: 75},
    {date: "2026-02-22", powerLevel: 90},
    {date: "2026-02-23", powerLevel: 85},
    {date: "2026-02-24", powerLevel: 70},
    {date: "2026-02-25", powerLevel: 95},
    {date: "2026-02-26", powerLevel: 82},
    {date: "2026-02-27", powerLevel: 88},
    {date: "2026-02-28", powerLevel: 78},
    {date: "2026-03-01", powerLevel: 92},
    {date: "2026-03-02", powerLevel: 80},
    {date: "2026-03-03", powerLevel: 85},
    {date: "2026-03-04", powerLevel: 90},
    {date: "2026-03-05", powerLevel: 78},
    {date: "2026-03-06", powerLevel: 88},
    {date: "2026-03-07", powerLevel: 95},
    {date: "2026-03-08", powerLevel: 80},
    {date: "2026-03-09", powerLevel: 85},
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
    {date: "2026-02-08", waterUsed: 82},
    {date: "2026-03-02", waterUsed: 85},
    {date: "2026-04-02", waterUsed: 70},
    {date: "2026-05-02", waterUsed: 95},
    {date: "2026-06-02", waterUsed: 80},
    {date: "2026-07-02", waterUsed: 75},
    {date: "2026-08-02", waterUsed: 90},
    {date: "2026-09-02", waterUsed: 82},
    {date: "2026-10-02", waterUsed: 85},
    {date: "2026-11-02", waterUsed: 70},
    {date: "2026-12-02", waterUsed: 95},
    {date: "2027-01-02", waterUsed: 80},
    {date: "2027-02-02", waterUsed: 75},
    {date: "2027-03-02", waterUsed: 90}
];
*/

// --- Aggregation Logic (Required for Weeks/Months view) ---
function startOfweekKey(dateISO: string) {
    const d = new Date(dateISO);
    const day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day);
    return d.toISOString().slice(0, 10);
}

function monthKey(dateISO: string) { return dateISO.slice(0, 7); }

function formatMonthLabel(month: string) {
    const [year, monthNumber] = month.split("-");
    const date = new Date(Number(year), Number(monthNumber) - 1, 1);

    return date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function keepLast12Months<T extends { date: string }>(data: T[]) {
    if (!data || data.length === 0) return [];

    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
    const latestDate = new Date(sorted[sorted.length - 1].date);
    const cutoff = new Date(latestDate);

    cutoff.setMonth(cutoff.getMonth() - 12);

    return sorted.filter((item) => new Date(item.date) >= cutoff);
}

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
    const [selectedPowerMonth, setSelectedPowerMonth] = useState("");
    const [selectedWaterMonth, setSelectedWaterMonth] = useState("");

    // Fetch live data from Ahmed's database via the API
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
                    headers: { Authorization: `Bearer: ${token}` },
                });
                const data = await res.json();
                setDashboardData(data);
            } catch (err) { console.error("Fetch error:", err); }
        };
        if (token) loadDashboardData();
    }, [token]);

const cappedPowerData = useMemo(() => {
    return keepLast12Months(dashboardData?.powerHistory || []);
}, [dashboardData]);

const cappedWaterData = useMemo(() => {
    return keepLast12Months(dashboardData?.waterHistory || []);
}, [dashboardData]);
    const availablePowerMonths = useMemo(() => {
        return Array.from(new Set(cappedPowerData.map((item) => item.date.slice(0, 7)))).sort();
    }, [cappedPowerData]);
    const availableWaterMonths = useMemo(() => {
        return Array.from(new Set(cappedWaterData.map((item) => item.date.slice(0, 7)))).sort();
    }, [cappedWaterData]);

    useEffect(() => {
        if (availablePowerMonths.length === 0) return;
        if (!selectedPowerMonth || !availablePowerMonths.includes(selectedPowerMonth)) {
            setSelectedPowerMonth(availablePowerMonths[availablePowerMonths.length - 1]);
        }
    }, [availablePowerMonths, selectedPowerMonth]);

    useEffect(() => {
        if (availableWaterMonths.length === 0) return;
        if (!selectedWaterMonth || !availableWaterMonths.includes(selectedWaterMonth)) {
            setSelectedWaterMonth(availableWaterMonths[availableWaterMonths.length - 1]);
        }
    }, [availableWaterMonths, selectedWaterMonth]);

    const filteredPowerData = useMemo(() => {
        if (selectedGraph1 !== "days" || !selectedPowerMonth) return cappedPowerData;

        return cappedPowerData.filter((item) => item.date.startsWith(selectedPowerMonth));
    }, [cappedPowerData, selectedGraph1, selectedPowerMonth]);
    const filteredWaterData = useMemo(() => {
        if (selectedGraph2 !== "days" || !selectedWaterMonth) return cappedWaterData;

        return cappedWaterData.filter((item) => item.date.startsWith(selectedWaterMonth));
    }, [cappedWaterData, selectedGraph2, selectedWaterMonth]);

    const dataToDisplay1 = useMemo(() => {
        return aggregateDataByRange(filteredPowerData, selectedGraph1, "powerLevel", "average");
    }, [filteredPowerData, selectedGraph1]);

    const dataToDisplay2 = useMemo(() => {
        return aggregateDataByRange(filteredWaterData, selectedGraph2, "waterUsed", "average");
    }, [filteredWaterData, selectedGraph2]);

    const hasEnoughData = (range: TimeRange, count: number) => range === "days" ? count >= 1 : count >= 2;
    const displayTooLil1 = !hasEnoughData(selectedGraph1, dataToDisplay1.length);
    const displayTooLil2 = !hasEnoughData(selectedGraph2, dataToDisplay2.length);

    const panelClassName =
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur";
    const selectClassName =
        "rounded-full border border-white/15 bg-[#032836] px-4 py-2 text-sm font-medium text-slate-100 outline-none transition hover:border-cyan-300/40 focus:border-cyan-300";
    const tooltipStyle = {
        backgroundColor: "#022533",
        border: "1px solid rgba(186, 230, 253, 0.18)",
        borderRadius: "16px",
        color: "#e2e8f0",
        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.28)",
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#011C27] text-white">
            <div className="relative isolate">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
                    <div className="absolute right-[-10rem] top-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
                </div>

                <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-12 pt-6 sm:px-8 lg:px-10">
                    {/* HEADER */}
                    <div className={`${panelClassName} flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between`}>
                        <div className="max-w-3xl">
                            <h1 className="text-5xl font-times leading-none text-white sm:text-6xl lg:text-7xl">
                                Hydration Station
                            </h1>
                            <p className="mt-3 text-lg text-slate-300 sm:text-xl">
                                Dashboard
                            </p>
                        </div>

                        <div className="pt-1 sm:pt-2">
                            <LogoutButton />
                        </div>
                    </div>

                    {/* REAL DATA CARDS */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className={`${panelClassName} bg-gradient-to-br from-cyan-300/14 via-white/6 to-white/5`}>
                            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-200/10 blur-2xl" />
                            <div className="relative">
                                <h2 className="text-2xl font-semibold text-white">Bottles Washed</h2>
                                <div className="mt-5">
                                    <p className="text-5xl font-semibold text-cyan-50 sm:text-6xl">
                                        {dashboardData?.bottlesWashed ?? "--"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`${panelClassName} bg-gradient-to-br from-emerald-300/14 via-white/6 to-white/5`}>
                            <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-emerald-200/10 blur-2xl" />
                            <div className="relative">
                                <h2 className="text-2xl font-semibold text-white">Last cleaning cycle</h2>
                                <div className="mt-5">
                                    <p className="text-4xl font-semibold text-emerald-50 sm:text-5xl">
                                        {dashboardData?.lastCleaningCycleAt
                                            ? new Date(dashboardData.lastCleaningCycleAt).toLocaleDateString()
                                            : "--"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Power Graph */}
                        <div className={panelClassName}>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Power Level Trends</h2>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <select value={selectedGraph1} onChange={(e) => setSelectedGraph1(e.target.value as TimeRange)} className={selectClassName}>
                                        <option value="days">Days</option>
                                        <option value="weeks">Weeks</option>
                                        <option value="months">Months</option>
                                    </select>

                                    {selectedGraph1 === "days" && availablePowerMonths.length > 0 && (
                                        <select
                                            value={selectedPowerMonth}
                                            onChange={(e) => setSelectedPowerMonth(e.target.value)}
                                            className={selectClassName}
                                        >
                                            {availablePowerMonths.map((month) => (
                                                <option key={month} value={month}>
                                                    {formatMonthLabel(month)}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="relative h-80 rounded-[1.5rem] border border-white/8 bg-[#021f2b]/80 p-4">
                                {displayTooLil1 && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.5rem] bg-[#011923]/72 backdrop-blur-sm">
                                        <p className="rounded-full border border-white/10 bg-slate-950/50 px-5 py-3 text-sm text-slate-100 shadow-lg">
                                            Check back later for {selectedGraph1} data.
                                        </p>
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dataToDisplay1} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                                        <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 8" />
                                        <XAxis dataKey="label" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis
                                            stroke="#cbd5e1"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={["dataMin", "dataMax"]}
                                        />
                                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(232, 121, 249, 0.35)", strokeWidth: 1 }} />
                                        <Legend wrapperStyle={{ paddingTop: 18 }} />
                                        <Line dataKey="powerLevel" name="Power level" stroke="#e879f9" strokeWidth={3} dot={{ r: 4, fill: "#e879f9", stroke: "#fdf4ff", strokeWidth: 1.5 }} activeDot={{ r: 6 }} />
                                        <RechartsDevtools />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Water Graph */}
                        <div className={panelClassName}>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Water Usage</h2>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <select value={selectedGraph2} onChange={(e) => setSelectedGraph2(e.target.value as TimeRange)} className={selectClassName}>
                                        <option value="days">Days</option>
                                        <option value="weeks">Weeks</option>
                                        <option value="months">Months</option>
                                    </select>

                                    {selectedGraph2 === "days" && availableWaterMonths.length > 0 && (
                                        <select
                                            value={selectedWaterMonth}
                                            onChange={(e) => setSelectedWaterMonth(e.target.value)}
                                            className={selectClassName}
                                        >
                                            {availableWaterMonths.map((month) => (
                                                <option key={month} value={month}>
                                                    {formatMonthLabel(month)}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="relative h-80 rounded-[1.5rem] border border-white/8 bg-[#021f2b]/80 p-4">
                                {displayTooLil2 && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.5rem] bg-[#011923]/72 backdrop-blur-sm">
                                        <p className="rounded-full border border-white/10 bg-slate-950/50 px-5 py-3 text-sm text-slate-100 shadow-lg">
                                            Check back later for {selectedGraph2} data.
                                        </p>
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dataToDisplay2} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                                        <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 8" />
                                        <XAxis dataKey="label" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis
                                            stroke="#cbd5e1"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={["dataMin", "dataMax"]}
                                        />
                                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(34, 211, 238, 0.35)", strokeWidth: 1 }} />
                                        <Legend wrapperStyle={{ paddingTop: 18 }} />
                                        <Line dataKey="waterUsed" name="Water used (L)" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: "#22d3ee", stroke: "#ecfeff", strokeWidth: 1.5 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

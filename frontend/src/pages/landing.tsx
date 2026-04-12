import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen overflow-hidden bg-[#011C27] text-white">
            <div className="relative isolate flex min-h-screen items-center justify-center px-6 py-10 sm:px-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
                    <div className="absolute right-[-10rem] top-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
                </div>

                <div className="relative w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8 lg:p-10">
                    <div className="flex flex-col items-center gap-8 text-center">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl font-times leading-none text-white sm:text-6xl lg:text-7xl">
                                Hydration Station
                            </h1>
                        </div>

                        <div className="w-full rounded-[1.75rem] border border-white/10 bg-[#01202c]/80 p-6 shadow-inner shadow-black/20 backdrop-blur">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="w-full rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:border-cyan-300/40 hover:bg-cyan-300/20"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

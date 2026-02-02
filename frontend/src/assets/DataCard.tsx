import React from "react";
type DataCardProps = {
    text: string;
    data: string | number;
}
export default function DataCard({text, data}: DataCardProps){
    return (
        <div className="w-full p-6  bg-[#91ACBD] text-white rounded-[200px]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <p className="text-white text-3xl md:text-4xl"> {text}:</p>
                <p className="text-3xl md:text-4xl font-bold">{data}</p>
            </div>
        </div>
    )
}
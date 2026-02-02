import React from "react";
type DataCardProps = {
    text: string;
    data: Date | number;
}
export default function DataCard({text, data}: DataCardProps){
    return (
        <div className="w-[75%] h-[181px] bg-[91ACBD]">
            <p> {text}: {data instanceof Date
                        ? data.toLocaleDateString()
                        : data}
            </p>
        </div>
    )
}
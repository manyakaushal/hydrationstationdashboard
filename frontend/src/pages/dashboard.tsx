import React from "react";

export default function Dashboard(){
    const token = localStorage.getItem("token");
    const res = async () => await fetch("http://localhost:4000/api/dashboard/data", {
        headers:{
            Authorization: `Bearer: ${token}`,
        },
    });
    return(
        <h1> This is Dashboard. </h1>
    )
}
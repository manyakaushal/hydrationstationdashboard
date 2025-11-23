import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton(){
    const navigate = useNavigate();

    const handleClick = () =>{
        localStorage.removeItem("token");
        navigate('/login');
    }
    return (
        <button 
            className="w-[50px] h-[50px] bg-[#3B6C80] text-white rounded-[100px] px-[13px]"
            onClick={handleClick}
        >
            <LogOut />
        </button>
    )
}
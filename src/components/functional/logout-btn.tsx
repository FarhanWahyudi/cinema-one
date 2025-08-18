import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = () => {
        Cookies.remove('jwt_token')
        Cookies.remove('user_role')
        toast.success('Logged out successfully')
        router.push('/?form=login')
    }
    return (
        <Button onClick={handleLogout} className="w-full bg-cyan-600">
            <LogOut className="mr-2 text-white" />
            Logout
        </Button>
    )
}
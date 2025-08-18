import { IUserStore, useUsersStore } from "@/store/users-store";
import { CircleUserRound, MapPin, Menu } from "lucide-react";
import { useState } from "react";
import SidebarMenuItems from "./sidebar-menuitems";

export default function Header() {
    const { user } = useUsersStore() as IUserStore;
    const [ openSidebar, setOpenSidebar ] = useState<boolean>(false);
    
    return (
        <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-5">
                <img
                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cinema_XXI.svg/2560px-Cinema_XXI.svg.png"}
                    alt="logo"
                    className="w-24"
                />
                <div className="flex items-center bg-slate-200 rounded-full px-5 py-1 gap-1">
                    <MapPin className="w-3.5" />
                    <h2 className="text-sm font-bold">MALANG</h2>
                </div>
            </div>
            <div className="flex gap-5 items-center text-cyan-600">
                <div className="flex items-center gap-1">
                    <h1 className=" font-bold uppercase">
                        {user?.name}
                    </h1>
                    <CircleUserRound />
                </div>
                <Menu
                    onClick={() => setOpenSidebar(true)}
                    className="cursor-pointer"
                    size={20}
                />
            </div>

            {openSidebar && <SidebarMenuItems {...{
                openSidebar,
                setOpenSidebar
            }} />}
        </div>
    )
}
import { IUserStore, useUsersStore } from "@/store/users-store";
import { Menu } from "lucide-react";
import { useState } from "react";
import SidebarMenuItems from "./sidebar-menuitems";

export default function Header() {
    const { user } = useUsersStore() as IUserStore;
    const [ openSidebar, setOpenSidebar ] = useState<boolean>(false);
    
    return (
        <div className="flex justify-between items-center p-6 bg-primary">
            <h1 className="text-xl font-bold text-white">
                Chinego
            </h1>
            <div className="flex gap-5 items-center text-white">
                <h1 className="text-sm">
                    {user?.name}
                </h1>
                <Menu
                    onClick={() => setOpenSidebar(true)}
                    className="cursor-pointer"
                    size={15}
                />
            </div>

            {openSidebar && <SidebarMenuItems {...{
                openSidebar,
                setOpenSidebar
            }} />}
        </div>
    )
}
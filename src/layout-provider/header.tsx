import { IUserStore, useUsersStore } from "@/store/users-store";
import { CircleUserRound, MapPin, Menu } from "lucide-react";
import { useState } from "react";
import SidebarMenuItems from "./sidebar-menuitems";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    const [openSheet, setOpenSheet] = useState(false);
    const [form, setForm] = useState<'login' | 'register'>('login')
    const { user } = useUsersStore() as IUserStore;
    const [ openSidebar, setOpenSidebar ] = useState<boolean>(false);

    return (
        <div className={`px-20 py-5 flex justify-between items-center fixed top-0 w-full z-100 bg-gradient-to-l from-cyan-600 to-blue-500`}>
                <div className="flex items-center gap-5">
                    <Link href={'/'}>
                        <img
                            src={"https://cinepolis.co.id/images/cinepolis-logo.png"}
                            alt="logo"
                            className="w-24"
                        />
                    </Link>
                    <div className="flex items-center text-white px-2 py-1 gap-1">
                        <MapPin className="w-3.5" />
                        <h2 className="text-sm font-semibold">MALANG</h2>
                    </div>
                </div>
                {user?.role === 'user' && (
                    <div className="text-white space-x-10 font-semibold">
                        <Link href="/user/movies">Movies</Link>
                        <Link href="/user/booking">Booking</Link>
                        <Link href="/user/profile">Profile</Link>
                    </div>
                )}
                <div className="flex gap-5 items-center text-white">
                    <Link  href={user?.role === 'user' ? `/user/profile` : '/admin/dashboard'} className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center uppercase font-bold
                        ">{user?.name[0]}</div>
                        <h1 className="text-lg mb-1">
                            {user?.name}
                        </h1>
                    </Link>
                    {user?.role === 'admin' && (
                        <Menu
                            onClick={() => setOpenSidebar(true)}
                            className="cursor-pointer mb-1"
                            size={20}
                        />
                    )}
                </div>
                {openSidebar && <SidebarMenuItems {...{
                    openSidebar,
                    setOpenSidebar
                }} />}
            </div>
        // <div className="flex justify-between items-center p-6 fixed z-100 top-0 w-full bg-white/10 backdrop-blur-xs shadow-xl shadow-white/20">
        //     <div className="flex items-center gap-5">
        //         <img
        //             src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cinema_XXI.svg/2560px-Cinema_XXI.svg.png"}
        //             alt="logo"
        //             className="w-24"
        //         />
        //         <div className="flex items-center bg-slate-200 rounded-full px-5 py-1 gap-1">
        //             <MapPin className="w-3.5" />
        //             <h2 className="text-sm font-bold">MALANG</h2>
        //         </div>
        //     </div>
        //     <div className="flex gap-5 items-center text-cyan-600">
        //         <div className="flex items-center gap-1">
        //             <h1 className=" font-bold uppercase">
        //                 {user?.name}
        //             </h1>
        //             <CircleUserRound />
        //         </div>
        //         <Menu
        //             onClick={() => setOpenSidebar(true)}
        //             className="cursor-pointer"
        //             size={20}
        //         />
        //     </div>

        //     {openSidebar && <SidebarMenuItems {...{
        //         openSidebar,
        //         setOpenSidebar
        //     }} />}
        // </div>
    )
}
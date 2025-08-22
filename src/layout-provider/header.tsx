import { IUserStore, useUsersStore } from "@/store/users-store";
import { CircleUserRound, MapPin, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import SidebarMenuItems from "./sidebar-menuitems";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    const [openSheet, setOpenSheet] = useState(false);
    const [form, setForm] = useState<'login' | 'register'>('login')
    const { user } = useUsersStore() as IUserStore;
    const [ openSidebar, setOpenSidebar ] = useState<boolean>(false);

    return (
        <div className={`px-20 py-5 flex justify-between items-center fixed top-0 w-full z-100 transition-all duration-300 bg-cyan-600`}>
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
                <div className="flex gap-10">
                    {user ?
                        (
                            <div className="flex gap-5 items-center text-white">
                                <div className="flex items-center gap-1">
                                    <h1 className=" font-bold uppercase">
                                        {user?.name}
                                    </h1>
                                    <CircleUserRound />
                                </div>
                                {user.role === 'admin' && (
                                    <Menu
                                        onClick={() => setOpenSidebar(true)}
                                        className="cursor-pointer"
                                        size={20}
                                    />
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => {setOpenSheet(true); setForm('login')}}
                                    className={`font-bold text-white`}
                                >
                                    Login
                                </button>
                                <Button
                                    onClick={() => {setOpenSheet(true); setForm('register')}}
                                    className='rounded-full bg-white text-cyan-600 font-semibold'>
                                    Buat Akun
                                </Button>
                            </>
                        )
                    }
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
import { Dispatch, SetStateAction } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IUserStore, useUsersStore } from "@/store/users-store";
import { IUser } from "@/interfaces";
import { Clapperboard, Clipboard, LayoutDashboard, ListCheck, Play, PlayCircle, SquareDashed, UserCheck, UserRoundPen } from "lucide-react";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/functional/logout-btn";

export default function SidebarMenuItems({
    openSidebar,
    setOpenSidebar
}: {
    openSidebar: boolean,
    setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}) {
    const { user } = useUsersStore() as IUserStore;
    const pathname = usePathname();

    const iconSize = 14

    const userMenuItems: any[] = [
        {
            name: 'Dashboard',
            path: '/user/dashboard',
            icon: <LayoutDashboard size={iconSize} />
        },
        {
            name: 'Movies',
            path: '/user/movies',
            icon: <Clapperboard size={iconSize} />
        },
        {
            name: 'Booking',
            path: '/user/booking',
            icon: <ListCheck size={iconSize} />
        },
        {
            name: 'Profile',
            path: '/user/profile',
            icon: <UserRoundPen size={iconSize} />
        },
    ];
    const adminMenuItems: any[] = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: <LayoutDashboard size={iconSize} />
        },
        {
            name: 'Movies',
            path: '/admin/movies',
            icon: <Clapperboard size={iconSize} />
        },
        {
            name: 'Theaters',
            path: '/admin/theaters',
            icon: <ListCheck size={iconSize} />
        },
        {
            name: 'Shows',
            path: '/admin/shows',
            icon: <PlayCircle size={iconSize} />
        },
        {
            name: 'Booking',
            path: '/admin/booking',
            icon: <ListCheck size={iconSize} />
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: <UserCheck size={iconSize} />
        },
    ];

    const menuItems: any[] = user?.role === 'admin' ? adminMenuItems : userMenuItems
    return (
        <Sheet
                open={openSidebar}
                onOpenChange={(open) => setOpenSidebar(open)}
            >
                <SheetContent className="min-w-[400px]">
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                        
                        <div className="flex flex-col gap-10 px-7 mt-10">
                            {menuItems.map((item) => (
                                <div key={item.name} className={`flex p-3 items-center gap-2 cursor-pointer ${
                                    pathname === item.path
                                        ? 'bg-gray-100 border border-primary rounded text-primary'
                                        : ''
                                }`}>
                                    {item.icon}
                                    <h1 className="text-sm">{item.name}</h1>
                                </div>
                            ))}
                            <LogoutButton />
                        </div>
                        
                    </SheetHeader>
                </SheetContent>
            </Sheet>
    )
}
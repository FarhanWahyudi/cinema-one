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
import { usePathname, useRouter } from "next/navigation";
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
    const router = useRouter();

    const iconSize = 16

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
            name: 'Theatres',
            path: '/admin/theatres',
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
                <SheetContent className="min-w-[400px] h-screen bg-gradient-to-tr from-cyan-50 to-cyan-200">
                    <SheetHeader className="h-full">
                        <SheetTitle></SheetTitle>
                        
                        <div className="flex flex-col justify-between h-full px-7 mt-10">
                            <div className="flex flex-col gap-5">
                                {menuItems.map((item) => (
                                    <div key={item.name} className={`flex p-5 items-center gap-2 cursor-pointer rounded-2xl from-cyan-400 to-cyan-200 hover:bg-cyan-200 transition-all duration-300 ${
                                        pathname === item.path
                                            ? 'bg-gradient-to-l border-primary text-primary'
                                            : ''
                                        }`}
                                        onClick={() => {
                                            setOpenSidebar(false);
                                            router.push(item.path);
                                        }}
                                    >
                                        {item.icon}
                                        <h1 className="font-semibold">{item.name}</h1>
                                    </div>
                                ))}
                            </div>
                            <LogoutButton />
                        </div>
                        
                    </SheetHeader>
                </SheetContent>
            </Sheet>
    )
}
'use client'

import { usePathname } from "next/navigation"
import PrivateLayout from "./private-layout";
import PublicLayout from "./public-layout";

export default function LayoutProvider({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    const isPrivateRoute = pathname.startsWith('/user') || pathname.startsWith('/admin')

    if (isPrivateRoute) {
        return (
            <PrivateLayout>
                {children}
            </PrivateLayout>
        )
    }
    return (
        <PublicLayout>
            {children}
        </PublicLayout>
    )
}
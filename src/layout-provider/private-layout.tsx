import { getLoggedInUser } from "@/actions/users";
import Header from "./header";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { IUserStore, useUsersStore } from "@/store/users-store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function PrivateLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const { setUser } = useUsersStore() as IUserStore;
    const fetchData = async () => {
        try {
            const response = await getLoggedInUser();
            if (!response.success) {
                throw new Error(response.message)
            }
            setUser(response.data);
        } catch (error) {
            Cookies.remove('jwt_token');
            router.push('/?form=login')
            toast.error('something went wrong while fetching data')
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 min-h-screen">
            <Header />
            <div className="p-5">
                {children}
            </div>
        </div>
    )
}
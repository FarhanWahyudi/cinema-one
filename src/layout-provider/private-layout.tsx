import { getLoggedInUser } from "@/actions/users";
import Header from "./header";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { IUserStore, useUsersStore } from "@/store/users-store";

export default function PrivateLayout({children}: {children: React.ReactNode}) {
    const { setUser } = useUsersStore() as IUserStore;
    const fetchData = async () => {
        try {
            const response = await getLoggedInUser();
            if (!response.success) {
                toast.error(response.message || 'something went wrong')
                return;
            }
            setUser(response.data);
        } catch (error) {
            toast.error('something went wrong while fetching data')
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Header />
            {children}
        </div>
    )
}
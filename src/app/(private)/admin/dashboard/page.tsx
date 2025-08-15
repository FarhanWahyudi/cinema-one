'use client'

import { getLoggedInUser } from "@/actions/users";
import UserInfo from "@/components/functional/user-info";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
    const [ user, setUser ] = useState(null);

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
            admin dashboard
            {user && <UserInfo user={user} />}
        </div>
    )
}
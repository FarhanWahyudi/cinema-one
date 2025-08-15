'use client'

import { getLoggedInUser } from "@/actions/users";
import UserInfo from "@/components/functional/user-info";
import { IUserStore, useUsersStore } from "@/store/users-store";

export default function AdminDashboardPage() {
    const { user } = useUsersStore() as IUserStore;

    return (
        <div>
            admin dashboard
            {user && <UserInfo user={user} />}
        </div>
    )
}
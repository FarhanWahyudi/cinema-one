"use client"

import { getUserDashboardData } from "@/actions/dashboard";
import DashboardCard from "@/components/functional/dashboard-card";
import Spinner from "@/components/functional/spinner";
import PageTitle from "@/components/ui/page-title";
import { IUserStore, useUsersStore } from "@/store/users-store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserDashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalMoviesWatched: 0,
        totalTicketsBooked: 0,
        totalAmountSpent: 0
    })
    const [loading, setLoading] = useState(false)
    const { user } = useUsersStore() as IUserStore
    const [error, setError] = useState<string | null>(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response: any = await getUserDashboardData(user?.id || '')
            if (response.success) {
                setDashboardData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error: any) {
            setError(error.message)
            toast.error('failed to fetch dashboard data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <h1>{error}</h1>
    }
    return (
        <div>
            <PageTitle title="User Dashboard" />
            <div className="grid grid-cols-4 gap-5 mt-5">
                <DashboardCard
                    title="Total Bookings"
                    value={dashboardData.totalBookings}
                    description="Total nummber of bookings made by the user"
                />
                <DashboardCard
                    title="Total Watched"
                    value={dashboardData.totalMoviesWatched}
                    description="Total nummber of movie watched by user"
                />
                <DashboardCard
                    title="Tickets Booked"
                    value={dashboardData.totalTicketsBooked}
                    description="Total nummber of tickets booked by the user"
                />
                <DashboardCard
                    title="Amount Spent"
                    value={dashboardData.totalAmountSpent}
                    description="Total amount spent by the user on bookings"
                    isCurrency={true}
                />
            </div>
        </div>
    )
}
"use client"

import { getAdminDashboardData, getUserDashboardData } from "@/actions/dashboard";
import DashboardCard from "@/components/functional/dashboard-card";
import Spinner from "@/components/functional/spinner";
import PageTitle from "@/components/ui/page-title";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalMovies:  0,
        totalThetres:  0,
        totalShows:  0,
        totalBookings:  0,
        totalUsers:  0,
        totalRevenue: 0,
        totalTicketsBooked: 0,
        cancelledTickets: 0,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response: any = await getAdminDashboardData()
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
        fetchDashboardData()
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <h1>{error}</h1>
    }
    return (
        <div>
            <PageTitle title="Admin Dashboard" />
            <div className="grid grid-cols-4 gap-5 mt-5">
                <DashboardCard
                    title="Total Movies"
                    value={dashboardData.totalMovies}
                    description="Total nummber of movies available in the system"
                />
                <DashboardCard
                    title="Total Theatres"
                    value={dashboardData.totalThetres}
                    description="Total nummber of theatres available in the system"
                />
                <DashboardCard
                    title="Total Shows"
                    value={dashboardData.totalShows}
                    description="Total nummber of shows available in the system"
                />
                <DashboardCard
                    title="Total Bookings"
                    value={dashboardData.totalBookings}
                    description="Total nummber of bookings available in the system"
                />
                <DashboardCard
                    title="Total Tickets Booked"
                    value={dashboardData.totalTicketsBooked}
                    description="Total nummber of tickets booked available in the system"
                />
                <DashboardCard
                    title="Canclled Tickets"
                    value={dashboardData.cancelledTickets}
                    description="Total nummber of tickets that were cancelled"
                />
                <DashboardCard
                    title="Total Users"
                    value={dashboardData.totalUsers}
                    description="Total nummber of user registered in the system"
                />
                <DashboardCard
                    title="Total Revenue"
                    value={dashboardData.totalRevenue}
                    description="Total amount spent by users on bookings"
                    isCurrency={true}
                />
                
            </div>
        </div>
    )
}
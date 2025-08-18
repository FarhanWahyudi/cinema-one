"use client"

import DashboardCard from "@/components/functional/dashboard-card";
import PageTitle from "@/components/ui/page-title";
import { useState } from "react";

export default function UserDashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalMoviesWatched: 0,
        totalTicketsBooked: 0,
        totalAmountSpent: 0
    })
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
                />
            </div>
        </div>
    )
}
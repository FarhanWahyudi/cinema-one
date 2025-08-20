"use client"

import { getUserDashboardData } from "@/actions/dashboard";
import DashboardCard from "@/components/functional/dashboard-card";
import Spinner from "@/components/functional/spinner";
import PageTitle from "@/components/ui/page-title";
import { IUserStore, useUsersStore } from "@/store/users-store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import data from "./data.json"

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
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-4 gap-5 mt-5">
                <DashboardCard
                    title="Total Pemesanan"
                    value={dashboardData.totalBookings}
                    description="Total pemesanan anda"
                />
                <DashboardCard
                    title="Total Menonton"
                    value={dashboardData.totalMoviesWatched}
                    description="Total anda telah menonton di kami"
                />
                <DashboardCard
                    title="Tiket Dipesan"
                    value={dashboardData.totalTicketsBooked}
                    description="Total tiket yang telah anda pesan"
                />
                <DashboardCard
                    title="Total Pembelanjaan"
                    value={dashboardData.totalAmountSpent}
                    description="Total pembelanjaan anda"
                    isCurrency={true}
                />
            </div>
            <ChartAreaInteractive />
            <div className="bg-white p-8 rounded-xl">
                <h2 className="font-bold text-2xl mb-5">Riwayat Tontonan</h2>
                <DataTable data={data} />
            </div>
        </div>
    )
}
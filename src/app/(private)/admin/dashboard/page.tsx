"use client"

import { getAdminDashboardData, getUserDashboardData } from "@/actions/dashboard";
import DashboardCard from "@/components/functional/dashboard-card";
import Spinner from "@/components/functional/spinner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import PageTitle from "@/components/ui/page-title";
import { formatDate } from "@/helpers/date-time-formats";
import { IBooking } from "@/interfaces";
import { Calendar, ChartLine } from "lucide-react";
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
        newBooking: [] as IBooking[]
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
        <div className="space-y-10">
            <PageTitle title="Admin Dashboard" />
            <div className="grid grid-cols-4 gap-5 mt-5">
                <DashboardCard
                    title="Film"
                    value={dashboardData.totalMovies}
                    description="Jumlah Film"
                />
                <DashboardCard
                    title="Users"
                    value={dashboardData.totalUsers}
                    description="Total User"
                />
                <DashboardCard
                    title="Pemesanan"
                    value={dashboardData.totalBookings}
                    description="Total Pemesanan"
                />
                <DashboardCard
                    title="Pendapatan"
                    value={dashboardData.totalRevenue}
                    description="Total Pendapatan"
                    isCurrency={true}
                />
            </div>
            <div className="flex gap-10">
                <div className="shadow bg-white shadow-gray-200 rounded-2xl p-7 border border-gray-200 space-y-5 w-[65%]">
                    <div className="flex gap-2 items-center">
                        <ChartLine size={20} className="text-green-500" />
                        <h2 className="font-semibold text-lg">Booking Terbaru</h2>
                    </div>
                    <div className="space-y-3">
                        {dashboardData.newBooking.map((booking) => (
                            <Card key={booking.id} className="p-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <img src={booking.movie?.poster_url} alt={booking.movie?.name} className="w-16 rounded-lg" />
                                        <div className="flex flex-col text-sm">
                                            <div className='flex items-center gap-0.5'>
                                                <div className="w-5 h-5 bg-blue-700 text-white rounded-full flex items-center justify-center uppercase font-bold text-xs
                                                    ">{booking.user?.name[0]}
                                                </div>
                                                <span className='capitalize text-black font-semibold'>{booking.user?.name}</span>
                                            </div>
                                            <span className="text-gray-600 font-semibold">{booking.movie?.name}</span>
                                            <span className="text-gray-600">{booking.theatre?.name}</span>
                                            <div className="text-gray-600 flex items-center gap-1">
                                                <Calendar size={15} />
                                                <span>{formatDate(booking.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className={`capitalize
                                        ${booking.status === 'booked' ? 'bg-yellow-400' : 'bg-red-400'}  
                                    `}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
                <Card className="flex-1">

                </Card>
            </div>
        </div>
    )
}
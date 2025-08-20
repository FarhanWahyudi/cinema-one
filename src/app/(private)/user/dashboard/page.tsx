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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getUserBookings } from "@/actions/bookings";
import { IBooking } from "@/interfaces";
import { formatDate, formatTime } from "@/helpers/date-time-formats";
import dayjs from "dayjs";
import Link from "next/link";

export default function UserDashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalMoviesWatched: 0,
        totalTicketsBooked: 0,
        totalAmountSpent: 0
    })
    const [bookings, setBookings] = useState<IBooking[]>([])
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

    const fetchBooking = async () => {
        try {
            const response: any = await getUserBookings(user!.id)
                
            if (response.success) {
                setBookings(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error: any) {
            toast.error('failed to fetch booking history')
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData()
            fetchBooking()
        }
    }, [user?.id])

    const columns = [
      'Teater',
      'Film',
      'Penayangan',
      'Kursi',
      'Jumlah Harga',
    ]

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <h1>{error}</h1>
    }
    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-4 gap-5 mt-5">
                <Link href="/admin/booking">
                    <DashboardCard
                        title="Total Pemesanan"
                        value={dashboardData.totalBookings}
                        description="Total pemesanan anda"
                    />
                </Link>
                <Link href="/admin/booking">
                    <DashboardCard
                        title="Total Menonton"
                        value={dashboardData.totalMoviesWatched}
                        description="Total anda telah menonton di kami"
                    />
                </Link>
                <Link href="/admin/booking">
                    <DashboardCard
                        title="Tiket Dipesan"
                        value={dashboardData.totalTicketsBooked}
                        description="Total tiket yang telah anda pesan"
                    />
                </Link>
                <Link href="/admin/booking">
                    <DashboardCard
                        title="Total Pembelanjaan"
                        value={dashboardData.totalAmountSpent}
                        description="Total pembelanjaan anda"
                        isCurrency={true}
                    />
                </Link>
            </div>
            <Link href="/user/booking" className="bg-white mt-10 p-8 rounded-xl">
                <h2 className="font-bold text-xl mb-5">Riwayat Tontonan</h2>
                <Table>
                    <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                        <TableHead key={column} className="text-left">{column}</TableHead>
                        ))}
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                        
                        <TableCell className="uppercase">{booking.theatre?.name}</TableCell>
                        <TableCell>{booking.movie?.name}</TableCell>
                        <TableCell>{formatDate(booking.show!.date)} - {formatTime(booking.show!.time)}</TableCell>
                        <TableCell>{booking.seat_number.join(', ')}</TableCell>
                        <TableCell>Rp {booking.total_amount.toFixed(3)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Link>
        </div>
    )
}
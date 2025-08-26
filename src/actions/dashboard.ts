"use server"

import supabase from "@/config/supabase-config"
import { success } from "zod"

export const getUserDashboardData = async (userId: string) => {
    try {
        const { data, error } = await supabase.from('bookings').select('*').eq('user_id', userId).eq('status', 'booked')
        
        if (error) {
            throw new Error(error.message)
        }

        let totalBookings = data.length
        let totalMoviesWatched = 0
        let totalTicketsBooked = 0
        let totalAmountSpent = 0

        let movieIdsObject: any = {}

        data.forEach((booking) => {
            totalTicketsBooked += booking.total_tickets
            totalAmountSpent += booking.total_amount

            if (!movieIdsObject[booking.movie_id]) {
                movieIdsObject[booking.movie_id] = true
                totalMoviesWatched += 1
            }
        })

        return {
            success: true,
            message: "Dashboard data fetched successfully",
            data: {
                totalBookings,
                totalMoviesWatched,
                totalTicketsBooked,
                totalAmountSpent
            }
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

export const getAdminDashboardData = async () => {
    try {
        const [moviesResponse, theatresResponse, showsResponse, bookingsResponse, usersResponse] = await Promise.all([
            supabase.from('movies').select('id'),
            supabase.from('theatres').select('id'),
            supabase.from('shows').select('id'),
            supabase.from('bookings').select('*, movie:movies(*), user:user_profiles(*), theatre:theatres(*)'),
            supabase.from('user_profiles').select('id'),
        ])

        if (
            moviesResponse.error ||
            theatresResponse.error ||
            showsResponse.error ||
            bookingsResponse.error ||
            usersResponse.error 
        ) {
            throw new Error(
                moviesResponse.error?.message ||
                theatresResponse.error?.message ||
                showsResponse.error?.message ||
                bookingsResponse.error?.message ||
                usersResponse.error?.message ||
                'Error fetching data'

            )
        }

        let responseData: any = {
            totalMovies: moviesResponse.data?.length || 0,
            totalThetres: theatresResponse.data?.length || 0,
            totalShows: showsResponse.data?.length || 0,
            totalBookings: bookingsResponse.data?.length || 0,
            totalUsers: usersResponse.data?.length || 0,
            newBooking: bookingsResponse.data
        }

        let totalRevenue = 0
        let totalTicketsBooked = 0
        let cancelledTickets = 0

        bookingsResponse.data.forEach((booking: any) => {
            totalTicketsBooked += booking.total_tickets
            if (booking.status === 'booked') {
                totalRevenue += booking.total_amount
            }

            if (booking.status === 'cancelled') {
                cancelledTickets += booking.total_tickets
            }
        })

        responseData.totalRevenue = totalRevenue
        responseData.totalTicketsBooked = totalTicketsBooked
        responseData.cancelledTickets = cancelledTickets

        return {
            success: true,
            message: 'admin dashboard data fetch successfully',
            data: responseData
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}
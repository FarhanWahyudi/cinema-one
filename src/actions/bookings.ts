"use server"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import supabase from "@/config/supabase-config";
import { IBooking, IMovie } from "@/interfaces";
import { error } from "console";
import { success } from "zod";

export const createBooking = async (booking: Partial<IBooking>) => {
    const { data, error } = await supabase.from('bookings').insert(booking)
    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: 'booking created successfullly'
    }
}

export const getAllBookings = async () => {
    const { data, error } = await supabase.from('bookings').select('*, theatre:theatres(*), movie:movies(*), show:shows(*)')

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: 'get all bookings successfully',
        data: data as IMovie[]
    }
}

export const getUserBookings = async (userId: string) => {
    const { data, error } = await supabase.from('bookings').select('*, theatre:theatres(*), movie:movies(*), show:shows(*)').eq('user_id', userId)

    if (error) {
        return {
            success: false,
            message: error.message,
            data: []
        }
    }

    return {
        success: true,
        data: data as IBooking[]
    }
}

export const cancelBooking = async (bookingId: string, showId: string, seatNumbers: number[], paymentId: string) => {
    try {
        const { error: updateError } = await supabase.from('bookings').update({
            status: 'cancelled'
        }).eq('id', bookingId)

        const { data: showData, error: showError } = await supabase.from('show').select('*').eq('id', showId)

        if (updateError || showError) {
            throw new Error(updateError?.message || showError?.message || 'Failed to cancel booking')
        }
        const show = showData?.[0]

        const updateBookedSeats = show.booked_seats.filter((seat: number) => !seatNumbers.includes(seat))

        const updateAvailableSeatsCount = show.availabel_seats_count + seatNumbers.length

        const { error: updateShowError } = await supabase.from('shows').update({
            booked_seats: updateBookedSeats,
            availabel_seats_count: updateAvailableSeatsCount
        }).eq('id', showId)

        if (updateShowError) {
            throw new Error(updateShowError.message)
        }

        const refundResponse = await stripe.refunds.create({
            payment_intent: paymentId
        })

        if (refundResponse.status !== 'success') {
            throw new Error('failed to issue refund')
        }

        return {
            success: true,
            message: 'booking cancelled successfully'
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}
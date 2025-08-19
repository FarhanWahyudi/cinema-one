"use server"

import supabase from "@/config/supabase-config";
import { IBooking } from "@/interfaces";
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
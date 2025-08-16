"use server"

import supabase from "@/config/supabase-config"
import { IShow } from "@/interfaces"
import { success } from "zod";

export const addShow = async (show: Partial<IShow>) => {
    const { data, error } = await supabase.from("shows").insert(show).select('*');

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "show added successfully"
    }
}

export const updateShow = async (id: string, shows: Partial<IShow>) => {
    const { data, error } = await supabase.from('shows').update(shows).eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "show updated successfully"
    }
}

export const deleteShow = async (id: string) => {
    const { data, error } = await supabase.from('shows').delete().eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "show deleted successfully"
    }
}

export const getShowById = async (id: string) => {
    const { data, error } = await supabase.from('shows').select('*').eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    if (data.length === 0) {
        return {
            success: false,
            message: 'show not found'
        }
    }

    return {
        success: true,
        message: "show get by id successfully",
        data: data[0] as IShow
    }
}

export const getAllShows = async () => {
    const { data, error } = await supabase.from('shows').select('*').order('created_at', { ascending: false})

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "shows get by id successfully",
        data: data as IShow[]
    }
}
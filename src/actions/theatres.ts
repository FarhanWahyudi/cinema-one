"use server"

import supabase from "@/config/supabase-config"
import { ITheatre } from "@/interfaces"

export const addTheatre = async (theatre: Partial<ITheatre>) => {
    const { data, error } = await supabase.from("theatres").insert([theatre]);

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "theatre added successfully"
    }
}

export const updateTheatre = async (id: string, theatre: Partial<ITheatre>) => {
    const { data, error } = await supabase.from('theatres').update(theatre).eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "theatre updated successfully"
    }
}

export const deleteTheatre = async (id: string) => {
    const { data, error } = await supabase.from('theatres').delete().eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "theatre deleted successfully"
    }
}

export const getTheatreById = async (id: string) => {
    const { data, error } = await supabase.from('theatres').select('*').eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    if (data.length === 0) {
        return {
            success: false,
            message: 'theatre not found'
        }
    }

    return {
        success: true,
        message: "theatre get by id successfully",
        data: data[0] as ITheatre
    }
}

export const getAllTheatres = async () => {
    const { data, error } = await supabase.from('theatres').select('*').order('created_at', { ascending: false})

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "theatres get by all successfully",
        data: data as ITheatre[]
    }
}
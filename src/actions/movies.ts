"use server"

import supabase from "@/config/supabase-config"
import { IMovie } from "@/interfaces"
import { success } from "zod";

export const addMovie = async (movie: Partial<IMovie>) => {
    const { data, error } = await supabase.from("movies").insert([movie]);

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "movie added successfully"
    }
}

export const updateMovie = async (id: string, movie: Partial<IMovie>) => {
    const { data, error } = await supabase.from('movies').update(movie).eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "movie updated successfully"
    }
}

export const deleteMovie = async (id: string) => {
    const { data, error } = await supabase.from('movies').delete().eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "movie deleted successfully"
    }
}

export const getMovieById = async (id: string) => {
    const { data, error } = await supabase.from('movies').select('*').eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    if (data.length === 0) {
        return {
            success: false,
            message: 'movie not found'
        }
    }

    return {
        success: true,
        message: "movie get by id successfully",
        data: data[0] as IMovie
    }
}

export const getAllMovies = async () => {
    const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false})

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        message: "movie get by id successfully",
        data: data as IMovie[]
    }
}

export const getActiveMovies = async (filters: any) => {
    let qry = supabase.from('movies').select('*').eq('is_active', true).order('created_at', { ascending: false})

    if (filters) {

    }

    const { data, error } = await qry

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: true,
        data: data as IMovie[]
    }
}
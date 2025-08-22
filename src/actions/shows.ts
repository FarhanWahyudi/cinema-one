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
    const { data, error } = await supabase.from('shows').select('*, movie:movies(*), theatre:theatres(*)').order('created_at', { ascending: false})

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

export const getShowByMovieId = async (movieId: string, date: string) => {
    try {
        const { data, error } = await supabase.from('shows').select('*, theatre:theatres(*)').eq('movie_id', movieId).eq('date', date)
        if (error) {
            return {
                success: false,
                message: error.message
            }
        }

        const groupedData: any = []
        const theatreIdsObject: any = {}

        data.forEach((show) => {
            if (theatreIdsObject[show.theatre.id]) {
                const addedObject = groupedData.find((group: any) => {
                    return group.theatre.id === show.theatre.id
                })
                addedObject.shows.push(show)
            } else {
                groupedData.push({
                    theatre: show.theatre,
                    shows: [show]
                })
                theatreIdsObject[show.theatre.id] = true
            }
        })

        return {
            success: true,
            message: 'shows fetched successfully',
            data: groupedData
        }

    } catch (error) {
        return {
            success: false,
            message: 'failed to fetch shows for the movie'
        }
    }
}

export const getShowByTheatreId = async (theaterId: string, date: string) => {
    try {
        const { data, error } = await supabase.from('shows').select('*, movie:movies(*)').eq('theatre_id', theaterId).eq('date', date)
        if (error) {
            return {
                success: false,
                message: error.message
            }
        }

        const groupedData: any = []
        const movieIdsObject: any = {}

        data.forEach((show) => {
            if (movieIdsObject[show.movie.id]) {
                const addedObject = groupedData.find((group: any) => {
                    return group.movie.id === show.movie.id
                })
                addedObject.shows.push(show)
            } else {
                groupedData.push({
                    movie: show.movie,
                    shows: [show]
                })
                movieIdsObject[show.movie.id] = true
            }
        })

        return {
            success: true,
            message: 'shows fetched successfully',
            data: groupedData
        }

    } catch (error) {
        return {
            success: false,
            message: 'failed to fetch shows for the movie'
        }
    }
}
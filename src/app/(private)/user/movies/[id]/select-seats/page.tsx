'use client'

import { getMovieById } from '@/actions/movies'
import { getShowById } from '@/actions/shows'
import { getTheatreById } from '@/actions/theatres'
import Spinner from '@/components/functional/spinner'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import { formatDate, formatTime } from '@/helpers/date-time-formats'
import { IMovie, IShow, ITheatre } from '@/interfaces'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { promise } from 'zod'

export default function SelectSeats() {
    const [loading, setLoading] = useState(false)
    const [movie, setMovie] = useState<IMovie | null>(null)
    const [theatre, setTheatre] = useState<ITheatre | null>(null)
    const [show, setShow] = useState<IShow | null>(null)

    const [error, setError] = useState<string | null>(null)
    const paramas = useParams()
    const searchParams = useSearchParams()

    const fetchData = async () => {
        try {
            setLoading(true)
            const [movieResponse, theatreResponse, showResponse]: any[] = await Promise.all([
                getMovieById(paramas.id as string),
                getTheatreById(searchParams.get('theatreId') as string),
                getShowById(searchParams.get('showId') as string)
            ])
            if (!movieResponse.success || !theatreResponse.success || !showResponse.success) {
                throw new Error(
                    movieResponse.message || theatreResponse.message || showResponse.message || 'Failed to fetch data'
                )
            }
            setMovie(movieResponse.data)
            setTheatre(theatreResponse.data)
            setShow(showResponse.data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <h1>{error}</h1>
    }

    if (movie && theatre && show) {
        return (
            <div className='flex flex-col gap-5'>
                <div className='flex justify-between items-center'>
                    <PageTitle title='Select Seats' />
                    <Button>Book Now</Button>
                </div>
                <div className='p-5 border bg-gray-200 border-gray-400 rounded-lg shadow-sm'>
                    <h1 className='text-lg font-bold'>{movie.name}</h1>
                    <p className='text-sm to-gray-600'>
                        {theatre.name} - {formatDate(show.date)} - {formatTime(show.time)}
                    </p>
                </div>

            </div>
        )
    }

    return (
       <h1>No data found</h1>

    )
}

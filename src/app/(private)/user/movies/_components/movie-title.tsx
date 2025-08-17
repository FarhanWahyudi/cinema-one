"use client"

import { formatDate } from '@/helpers/date-time-formats'
import { IMovie } from '@/interfaces'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function MovieTitle({ movie }: { movie: IMovie }) {
    const router = useRouter()
    return (
        <div onClick={() => router.push(`/user/movies/${movie.id}`)} className='border border-gray-400 rounded-lg p-3 hover:border-primary transition-all duration-300'>
            <img src={movie.poster_url} alt={movie.name} className='w-full h-72 object-cover rounded-lg mb-2' />
            <h1 className='text-lg font-bold text-primary'>{movie.name}</h1>
            <p className='text-sm font-semibold text-gray-500'>{movie.description}</p>
            <hr className='my-3 border-gray-300' />
            <h1 className='text-sm text-gray-700'>
                Release Date: {formatDate(movie.release_date)}
            </h1>
            <h1 className='text-sm text-gray-700'>Genre: {movie.genre}</h1>
        </div>
    )
}

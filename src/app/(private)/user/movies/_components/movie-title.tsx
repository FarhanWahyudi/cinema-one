"use client"

import { formatDate } from '@/helpers/date-time-formats'
import { IMovie } from '@/interfaces'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function MovieTitle({ movie }: { movie: IMovie }) {
    const router = useRouter()
    return (
        <div onClick={() => router.push(`/user/movies/${movie.id}`)} className='rounded-xl transition-all cursor-pointer duration-300'>
            <img src={movie.poster_url} alt={movie.name} className='w-full object-cover rounded-lg mb-2 hover:scale-105 transition-all duration-300' />
            <h1 className=' font-bold text-primary truncate uppercase'>{movie.name}</h1>
            <hr className='my-3 border-gray-300' />
            <h1 className='text-sm text-gray-700'>
                Tanggal Rilis: {formatDate(movie.release_date)}
            </h1>
            <h1 className='text-sm text-gray-700 capitalize'>Genre: {movie.genre}</h1>
        </div>
    )
}
